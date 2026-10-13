-- Production hardening: keep recycle-bin visibility under caller RLS
-- and limit administrative helper RPCs to authenticated sessions.
ALTER VIEW public.kram_bin_items SET (security_invoker = true);

REVOKE EXECUTE ON FUNCTION public.can_manage_country(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_org_role(uuid, public.app_role[]) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.update_organization_default_currency(uuid, text) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.can_manage_country(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_org_role(uuid, public.app_role[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_organization_default_currency(uuid, text) TO authenticated;

-- Public enquiry RPCs intentionally remain callable by anon: they are the
-- website's public intake endpoints and enforce validation/rate limiting.
