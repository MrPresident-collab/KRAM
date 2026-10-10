CREATE OR REPLACE FUNCTION public.get_client_approval_requests()
RETURNS TABLE (
  work_order_id uuid, asset_id uuid, asset_name text, work_order_title text,
  estimated_cost numeric, approval_status text, work_order_status text, requested_at timestamptz
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT w.id, a.id, a.name, w.title, w.estimated_cost, w.client_approval, w.status, w.created_at
  FROM public.work_orders w
  JOIN public.assets a ON a.id = w.asset_id
  JOIN public.clients c ON c.id = a.client_id
  WHERE c.profile_id = auth.uid() AND c.status = 'active'
    AND w.organization_id = c.organization_id
    AND w.client_approval = 'pending' AND w.deleted_at IS NULL
  ORDER BY w.created_at DESC
$$;
REVOKE ALL ON FUNCTION public.get_client_approval_requests() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_client_approval_requests() TO authenticated;

CREATE OR REPLACE FUNCTION public.respond_to_client_approval(p_work_order_id uuid, p_decision text)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE v_client_id uuid; v_org_id uuid;
BEGIN
  IF p_decision NOT IN ('approved','rejected') THEN RAISE EXCEPTION 'Decision must be approved or rejected'; END IF;
  SELECT c.id, c.organization_id INTO v_client_id, v_org_id
  FROM public.clients c WHERE c.profile_id = auth.uid() AND c.status = 'active' LIMIT 1;
  IF v_client_id IS NULL THEN RAISE EXCEPTION 'Active KRAM client account required'; END IF;
  UPDATE public.work_orders w
  SET client_approval = p_decision, updated_at = now()
  FROM public.assets a
  WHERE w.id = p_work_order_id AND w.asset_id = a.id
    AND a.client_id = v_client_id AND a.organization_id = v_org_id
    AND w.organization_id = v_org_id AND w.client_approval = 'pending' AND w.deleted_at IS NULL;
  IF NOT FOUND THEN RAISE EXCEPTION 'Pending approval request not found for this client'; END IF;
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.respond_to_client_approval(uuid,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.respond_to_client_approval(uuid,text) TO authenticated;
