-- Client-role restrictions are RESTRICTIVE so they intersect with existing
-- permissive staff policies instead of being bypassed by their OR semantics.
DROP POLICY IF EXISTS "client isolation assets select" ON public.assets;
CREATE POLICY "client isolation assets select" ON public.assets AS RESTRICTIVE FOR SELECT TO authenticated
USING (public.current_kram_client_id() IS NULL OR client_id = public.current_kram_client_id());

DROP POLICY IF EXISTS "client isolation conversations select" ON public.client_conversations;
CREATE POLICY "client isolation conversations select" ON public.client_conversations AS RESTRICTIVE FOR SELECT TO authenticated
USING (public.current_kram_client_id() IS NULL OR client_id = public.current_kram_client_id());

DROP POLICY IF EXISTS "client isolation messages select" ON public.client_conversation_messages;
CREATE POLICY "client isolation messages select" ON public.client_conversation_messages AS RESTRICTIVE FOR SELECT TO authenticated
USING (
  public.current_kram_client_id() IS NULL OR (
    visibility = 'client' AND EXISTS (
      SELECT 1 FROM public.client_conversations c
      WHERE c.id = conversation_id
        AND c.organization_id = client_conversation_messages.organization_id
        AND c.client_id = public.current_kram_client_id()
    )
  )
);

DROP POLICY IF EXISTS "client isolation documents select" ON public.documents;
CREATE POLICY "client isolation documents select" ON public.documents AS RESTRICTIVE FOR SELECT TO authenticated
USING (
  public.current_kram_client_id() IS NULL OR (
    client_id = public.current_kram_client_id()
    AND EXISTS (
      SELECT 1 FROM public.clients c
      WHERE c.id = documents.client_id AND c.profile_id = auth.uid()
        AND c.status = 'active' AND c.organization_id = documents.organization_id
    )
    AND (asset_id IS NULL OR EXISTS (
      SELECT 1 FROM public.assets a
      WHERE a.id = documents.asset_id AND a.client_id = public.current_kram_client_id()
        AND a.organization_id = documents.organization_id
    ))
    AND (conversation_id IS NULL OR EXISTS (
      SELECT 1 FROM public.client_conversations cc
      WHERE cc.id = documents.conversation_id AND cc.client_id = public.current_kram_client_id()
        AND cc.organization_id = documents.organization_id
    ))
  )
);

DROP POLICY IF EXISTS "client isolation reports select" ON public.reports;
CREATE POLICY "client isolation reports select" ON public.reports AS RESTRICTIVE FOR SELECT TO authenticated
USING (
  public.current_kram_client_id() IS NULL OR (
    status = 'published' AND deleted_at IS NULL AND asset_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.assets a JOIN public.clients c ON c.id = a.client_id
      WHERE a.id = reports.asset_id AND a.client_id = public.current_kram_client_id()
        AND a.organization_id = reports.organization_id AND c.profile_id = auth.uid()
        AND c.status = 'active'
    )
  )
);

-- Until approvals have explicit client-targeting semantics, never expose staff-wide approvals.
DROP POLICY IF EXISTS "client isolation approvals select" ON public.approvals;
CREATE POLICY "client isolation approvals select" ON public.approvals AS RESTRICTIVE FOR SELECT TO authenticated
USING (public.current_kram_client_id() IS NULL);
