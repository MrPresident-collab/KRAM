-- KRAM client portal foundation. Client users never inherit staff-only visibility.
CREATE OR REPLACE FUNCTION public.current_kram_client_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT c.id
  FROM public.clients c
  WHERE c.profile_id = auth.uid() AND c.status = 'active'
  LIMIT 1
$$;
REVOKE ALL ON FUNCTION public.current_kram_client_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_kram_client_id() TO authenticated;

DROP POLICY IF EXISTS "clients can view their own assets" ON public.assets;
CREATE POLICY "clients can view their own assets" ON public.assets
FOR SELECT TO authenticated
USING (client_id = (SELECT public.current_kram_client_id()));

DROP POLICY IF EXISTS "clients can view their own conversations" ON public.client_conversations;
CREATE POLICY "clients can view their own conversations" ON public.client_conversations
FOR SELECT TO authenticated
USING (client_id = (SELECT public.current_kram_client_id()));

DROP POLICY IF EXISTS "clients can start their own support conversations" ON public.client_conversations;
CREATE POLICY "clients can start their own support conversations" ON public.client_conversations
FOR INSERT TO authenticated
WITH CHECK (
  client_id = (SELECT public.current_kram_client_id())
  AND EXISTS (
    SELECT 1 FROM public.clients c
    WHERE c.id = client_conversations.client_id
      AND c.organization_id = client_conversations.organization_id
      AND c.profile_id = auth.uid() AND c.status = 'active'
  )
  AND (asset_id IS NULL OR EXISTS (
    SELECT 1 FROM public.assets a
    WHERE a.id = client_conversations.asset_id
      AND a.client_id = client_conversations.client_id
      AND a.organization_id = client_conversations.organization_id
  ))
  AND work_order_id IS NULL AND inspection_id IS NULL AND project_id IS NULL
);

DROP POLICY IF EXISTS "clients can view their own conversation messages" ON public.client_conversation_messages;
CREATE POLICY "clients can view their own conversation messages" ON public.client_conversation_messages
FOR SELECT TO authenticated
USING (
  visibility = 'client'
  AND EXISTS (
    SELECT 1 FROM public.client_conversations c
    WHERE c.id = client_conversation_messages.conversation_id
      AND c.organization_id = client_conversation_messages.organization_id
      AND c.client_id = (SELECT public.current_kram_client_id())
  )
);

DROP POLICY IF EXISTS "clients can send messages in their own conversations" ON public.client_conversation_messages;
CREATE POLICY "clients can send messages in their own conversations" ON public.client_conversation_messages
FOR INSERT TO authenticated
WITH CHECK (
  sender_client_id = (SELECT public.current_kram_client_id())
  AND sender_user_id IS NULL AND visibility = 'client' AND message_type = 'message'
  AND EXISTS (
    SELECT 1 FROM public.client_conversations c
    WHERE c.id = client_conversation_messages.conversation_id
      AND c.organization_id = client_conversation_messages.organization_id
      AND c.client_id = (SELECT public.current_kram_client_id())
  )
);

DROP POLICY IF EXISTS "clients can view explicitly shared documents" ON public.documents;
CREATE POLICY "clients can view explicitly shared documents" ON public.documents
FOR SELECT TO authenticated
USING (
  client_id = (SELECT public.current_kram_client_id())
  AND EXISTS (
    SELECT 1 FROM public.clients c
    WHERE c.id = documents.client_id AND c.organization_id = documents.organization_id
      AND c.profile_id = auth.uid() AND c.status = 'active'
  )
  AND (asset_id IS NULL OR EXISTS (
    SELECT 1 FROM public.assets a
    WHERE a.id = documents.asset_id AND a.client_id = documents.client_id
      AND a.organization_id = documents.organization_id
  ))
  AND (conversation_id IS NULL OR EXISTS (
    SELECT 1 FROM public.client_conversations cc
    WHERE cc.id = documents.conversation_id AND cc.client_id = documents.client_id
      AND cc.organization_id = documents.organization_id
  ))
);

DROP POLICY IF EXISTS "clients can view published reports for their assets" ON public.reports;
CREATE POLICY "clients can view published reports for their assets" ON public.reports
FOR SELECT TO authenticated
USING (
  status = 'published' AND deleted_at IS NULL AND asset_id IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.assets a JOIN public.clients c ON c.id = a.client_id
    WHERE a.id = reports.asset_id AND a.client_id = (SELECT public.current_kram_client_id())
      AND a.organization_id = reports.organization_id AND c.profile_id = auth.uid()
      AND c.status = 'active'
  )
);

CREATE OR REPLACE FUNCTION public.start_client_support_conversation(
  p_subject text,
  p_body text,
  p_asset_id uuid DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_client_id uuid;
  v_org_id uuid;
  v_conversation_id uuid;
  v_body text := btrim(coalesce(p_body, ''));
  v_subject text := btrim(coalesce(p_subject, ''));
BEGIN
  SELECT c.id, c.organization_id INTO v_client_id, v_org_id
  FROM public.clients c WHERE c.profile_id = auth.uid() AND c.status = 'active' LIMIT 1;
  IF v_client_id IS NULL THEN RAISE EXCEPTION 'Active KRAM client account required'; END IF;
  IF length(v_subject) < 1 OR length(v_subject) > 180 THEN RAISE EXCEPTION 'Subject must contain 1 to 180 characters'; END IF;
  IF length(v_body) < 2 OR length(v_body) > 5000 THEN RAISE EXCEPTION 'Message must contain 2 to 5000 characters'; END IF;
  IF p_asset_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.assets a WHERE a.id = p_asset_id AND a.client_id = v_client_id AND a.organization_id = v_org_id
  ) THEN RAISE EXCEPTION 'Asset is not linked to this client'; END IF;
  INSERT INTO public.client_conversations (
    organization_id, client_id, subject, channel, status, priority, asset_id, created_by
  ) VALUES (v_org_id, v_client_id, v_subject, 'portal', 'open', 'normal', p_asset_id, auth.uid())
  RETURNING id INTO v_conversation_id;
  INSERT INTO public.client_conversation_messages (
    organization_id, conversation_id, sender_client_id, sender_user_id, body, visibility, message_type
  ) VALUES (v_org_id, v_conversation_id, v_client_id, NULL, v_body, 'client', 'message');
  UPDATE public.client_conversations SET last_message_at = now(), updated_at = now()
  WHERE id = v_conversation_id;
  RETURN v_conversation_id;
END;
$$;
REVOKE ALL ON FUNCTION public.start_client_support_conversation(text,text,uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.start_client_support_conversation(text,text,uuid) TO authenticated;
