CREATE TABLE IF NOT EXISTS public.client_enquiries (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id uuid NOT NULL REFERENCES public.organizations(id),
 full_name text NOT NULL CHECK(char_length(btrim(full_name)) BETWEEN 2 AND 160),
 email text NOT NULL CHECK(char_length(email) BETWEEN 5 AND 254),
 phone text, residence text NOT NULL, asset_location text NOT NULL, asset_type text NOT NULL,
 help_needed text[] NOT NULL CHECK(cardinality(help_needed)>0), details text,
 preferred_contact text NOT NULL CHECK(preferred_contact IN ('email','phone','whatsapp')),
 preferred_language text NOT NULL DEFAULT 'fr' CHECK(preferred_language IN ('en','fr','pt')),
 status text NOT NULL DEFAULT 'new' CHECK(status IN ('new','reviewing','contacted','qualified','declined','converted')),
 assigned_to uuid REFERENCES auth.users(id), reviewed_by uuid REFERENCES auth.users(id), reviewed_at timestamptz,
 converted_client_id uuid REFERENCES public.clients(id), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.client_enquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authorized staff can view enquiries" ON public.client_enquiries;
CREATE POLICY "authorized staff can view enquiries" ON public.client_enquiries FOR SELECT TO authenticated
USING(public.has_org_role(organization_id, ARRAY['owner','admin','regional_admin','support','operations']::public.app_role[]));
DROP POLICY IF EXISTS "authorized staff can update enquiries" ON public.client_enquiries;
CREATE POLICY "authorized staff can update enquiries" ON public.client_enquiries FOR UPDATE TO authenticated
USING(public.has_org_role(organization_id, ARRAY['owner','admin','regional_admin','support','operations']::public.app_role[]))
WITH CHECK(public.has_org_role(organization_id, ARRAY['owner','admin','regional_admin','support','operations']::public.app_role[]));
REVOKE ALL ON public.client_enquiries FROM anon, authenticated;
GRANT SELECT, UPDATE ON public.client_enquiries TO authenticated;

CREATE OR REPLACE FUNCTION public.submit_public_client_enquiry(
 p_full_name text,p_email text,p_phone text,p_residence text,p_asset_location text,p_asset_type text,
 p_help_needed text[],p_details text,p_preferred_contact text,p_language text
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=''
AS $func$
DECLARE
 v_org uuid; v_id uuid; v_bucket text; v_count integer;
 v_name text:=btrim(coalesce(p_full_name,'')); v_email text:=lower(btrim(coalesce(p_email,'')));
 v_residence text:=btrim(coalesce(p_residence,'')); v_location text:=btrim(coalesce(p_asset_location,''));
 v_type text:=btrim(coalesce(p_asset_type,'')); v_details text:=btrim(coalesce(p_details,''));
BEGIN
 IF char_length(v_name)<2 OR char_length(v_name)>160 THEN RAISE EXCEPTION 'Please provide a valid full name'; END IF;
 IF v_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' OR char_length(v_email)>254 THEN RAISE EXCEPTION 'Please provide a valid email'; END IF;
 IF char_length(v_residence)<2 OR char_length(v_residence)>120 OR char_length(v_location)<2 OR char_length(v_location)>180 THEN RAISE EXCEPTION 'Please provide valid locations'; END IF;
 IF char_length(v_type)<2 OR char_length(v_type)>100 OR char_length(coalesce(p_phone,''))>40 THEN RAISE EXCEPTION 'Please check asset details'; END IF;
 IF coalesce(cardinality(p_help_needed),0)<1 OR cardinality(p_help_needed)>6 OR EXISTS(SELECT 1 FROM unnest(p_help_needed) h WHERE char_length(h)>100) THEN RAISE EXCEPTION 'Choose at least one valid service'; END IF;
 IF char_length(v_details)>2000 THEN RAISE EXCEPTION 'Details are too long'; END IF;
 IF p_preferred_contact NOT IN ('email','phone','whatsapp') OR p_language NOT IN ('en','fr','pt') THEN RAISE EXCEPTION 'Invalid contact preference'; END IF;
 v_bucket:='public-enquiry:'||md5(v_email);
 INSERT INTO public.api_rate_limits(bucket_key,window_started_at,request_count,updated_at) VALUES(v_bucket,now(),1,now())
 ON CONFLICT(bucket_key) DO UPDATE SET window_started_at=CASE WHEN public.api_rate_limits.window_started_at<now()-interval '1 hour' THEN now() ELSE public.api_rate_limits.window_started_at END,
 request_count=CASE WHEN public.api_rate_limits.window_started_at<now()-interval '1 hour' THEN 1 ELSE public.api_rate_limits.request_count+1 END,updated_at=now()
 RETURNING request_count INTO v_count;
 IF v_count>5 THEN RAISE EXCEPTION 'Too many enquiries. Please try again later'; END IF;
 SELECT id INTO v_org FROM public.organizations WHERE slug='kram' LIMIT 1;
 IF v_org IS NULL THEN RAISE EXCEPTION 'KRAM intake is not configured'; END IF;
 INSERT INTO public.client_enquiries(organization_id,full_name,email,phone,residence,asset_location,asset_type,help_needed,details,preferred_contact,preferred_language)
 VALUES(v_org,v_name,v_email,nullif(btrim(coalesce(p_phone,'')),''),v_residence,v_location,v_type,p_help_needed,nullif(v_details,''),p_preferred_contact,p_language)
 RETURNING id INTO v_id;
 RETURN v_id;
END;
$func$;
REVOKE ALL ON FUNCTION public.submit_public_client_enquiry(text,text,text,text,text,text,text[],text,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_public_client_enquiry(text,text,text,text,text,text[],text,text,text) TO anon, authenticated;
