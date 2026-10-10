ALTER TABLE public.client_enquiries
  ADD COLUMN IF NOT EXISTS assets jsonb NOT NULL DEFAULT '[]'::jsonb;

CREATE OR REPLACE FUNCTION public.submit_public_client_enquiry(
 p_full_name text,p_email text,p_phone text,p_residence text,p_asset_location text,p_asset_type text,
 p_help_needed text[],p_details text,p_preferred_contact text,p_language text,p_assets jsonb
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=''
AS $func$
DECLARE
 v_org uuid; v_id uuid; v_bucket text; v_count integer;
 v_name text:=btrim(coalesce(p_full_name,'')); v_email text:=lower(btrim(coalesce(p_email,'')));
 v_residence text:=btrim(coalesce(p_residence,'')); v_location text:=btrim(coalesce(p_asset_location,''));
 v_type text:=btrim(coalesce(p_asset_type,'')); v_details text:=btrim(coalesce(p_details,''));
 v_first jsonb; v_asset jsonb;
BEGIN
 IF char_length(v_name)<2 OR char_length(v_name)>160 THEN RAISE EXCEPTION 'Please provide a valid full name'; END IF;
 IF v_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' OR char_length(v_email)>254 THEN RAISE EXCEPTION 'Please provide a valid email'; END IF;
 IF char_length(v_residence)<2 OR char_length(v_residence)>120 OR char_length(coalesce(p_phone,''))>40 THEN RAISE EXCEPTION 'Please provide valid contact details'; END IF;
 IF jsonb_typeof(p_assets)<>'array' OR jsonb_array_length(p_assets)<1 OR jsonb_array_length(p_assets)>20 THEN RAISE EXCEPTION 'Provide between 1 and 20 assets'; END IF;
 FOR v_asset IN SELECT value FROM jsonb_array_elements(p_assets) AS entries(value) LOOP
   IF jsonb_typeof(v_asset)<>'object'
     OR char_length(btrim(coalesce(v_asset->>'asset_type','')))<2
     OR char_length(btrim(coalesce(v_asset->>'asset_type','')))>100
     OR char_length(btrim(coalesce(v_asset->>'asset_location','')))<2
     OR char_length(btrim(coalesce(v_asset->>'asset_location','')))>500
     OR jsonb_typeof(v_asset->'help_needed')<>'array'
     OR jsonb_array_length(v_asset->'help_needed')<1
     OR jsonb_array_length(v_asset->'help_needed')>6
   THEN RAISE EXCEPTION 'Please check each asset and its requested services'; END IF;
   IF EXISTS(SELECT 1 FROM jsonb_array_elements_text(v_asset->'help_needed') AS h(value) WHERE char_length(value)>100) THEN
     RAISE EXCEPTION 'Requested service labels are too long';
   END IF;
 END LOOP;
 v_first:=p_assets->0;
 v_location:=left(btrim(coalesce(v_first->>'asset_location','')),180);
 v_type:=btrim(coalesce(v_first->>'asset_type',''));
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
 INSERT INTO public.client_enquiries(organization_id,full_name,email,phone,residence,asset_location,asset_type,help_needed,details,preferred_contact,preferred_language,assets)
 VALUES(v_org,v_name,v_email,nullif(btrim(coalesce(p_phone,'')),''),v_residence,v_location,v_type,
   ARRAY(SELECT jsonb_array_elements_text(v_first->'help_needed')),nullif(v_details,''),p_preferred_contact,p_language,p_assets)
 RETURNING id INTO v_id;
 RETURN v_id;
END;
$func$;

REVOKE ALL ON FUNCTION public.submit_public_client_enquiry(text,text,text,text,text,text,text[],text,text,text,jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_public_client_enquiry(text,text,text,text,text,text,text[],text,text,text,jsonb) TO anon, authenticated;