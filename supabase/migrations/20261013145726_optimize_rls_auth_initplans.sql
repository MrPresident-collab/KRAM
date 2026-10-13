-- Avoid per-row re-evaluation of auth.uid() in RLS policies.
DROP POLICY IF EXISTS "Global and country admins can permanently delete binned expense" ON public.expenses;
CREATE POLICY "Global and country admins can permanently delete binned expense"
ON public.expenses FOR DELETE TO authenticated
USING (
  deleted_at IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.organization_id = expenses.organization_id
      AND om.user_id = (SELECT auth.uid())
      AND om.status = 'active'
      AND om.scope_level = ANY (ARRAY['global'::public.access_scope_level,'country'::public.access_scope_level])
      AND om.role = ANY (ARRAY['owner'::public.app_role,'admin'::public.app_role,'regional_admin'::public.app_role])
  )
);

DROP POLICY IF EXISTS "Staff can create case events" ON public.client_conversation_events;
CREATE POLICY "Staff can create case events"
ON public.client_conversation_events FOR INSERT TO authenticated
WITH CHECK (
  actor_id = (SELECT auth.uid())
  AND EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.user_id = (SELECT auth.uid())
      AND om.organization_id = client_conversation_events.organization_id
      AND om.status = 'active'
  )
  AND EXISTS (
    SELECT 1 FROM public.client_conversations c
    WHERE c.id = client_conversation_events.conversation_id
      AND c.organization_id = client_conversation_events.organization_id
      AND public.can_access_client(c.organization_id, c.client_id)
  )
);

DROP POLICY IF EXISTS "Finance operations can create scoped client financial reports" ON public.client_financial_reports;
CREATE POLICY "Finance operations can create scoped client financial reports"
ON public.client_financial_reports FOR INSERT TO authenticated
WITH CHECK (
  status = 'draft'
  AND created_by = (SELECT auth.uid())
  AND EXISTS (
    SELECT 1 FROM public.assets a
    JOIN public.work_orders wo ON wo.asset_id = a.id
    JOIN public.clients c ON c.id = a.client_id
    WHERE a.id = client_financial_reports.asset_id
      AND a.client_id = client_financial_reports.client_id
      AND a.organization_id = client_financial_reports.organization_id
      AND wo.id = client_financial_reports.work_order_id
      AND wo.organization_id = client_financial_reports.organization_id
      AND c.organization_id = client_financial_reports.organization_id
      AND public.has_scoped_role(
        client_financial_reports.organization_id,
        a.branch_id,
        ARRAY['owner'::public.app_role,'admin'::public.app_role,'operations'::public.app_role,'finance'::public.app_role,'regional_admin'::public.app_role]
      )
  )
);