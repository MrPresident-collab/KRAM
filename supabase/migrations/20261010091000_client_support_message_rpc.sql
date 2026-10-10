CREATE OR REPLACE FUNCTION public.send_client_support_message(
  p_conversation_id uuid,
  p_body text
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_client_id uuid;
  v_org_id uuid;
  v_message_id uuid;
  v_body text := btrim(coalesce(p_body, ''));
BEGIN
  SELECT c.id, c.organization_id INTO v_client_id, v_org_id
  FROM public.clients c
  WHERE c.profile_id = auth.uid() AND c.status = 'active'
  LIMIT 1;
  IF v_client_id IS NULL THEN RAISE EXCEPTION 'Active KRAM client account required'; END IF;
  IF length(v_body) < 1 OR length(v_body) > 5000 THEN
    RAISE EXCEPTION 'Message must contain between 1 and 5000 characters';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.client_conversations cc
    WHERE cc.id = p_conversation_id AND cc.client_id = v_client_id AND cc.organization_id = v_org_id
      AND cc.status NOT IN ('closed', 'resolved')
  ) THEN RAISE EXCEPTION 'Open client conversation not found'; END IF;
  INSERT INTO public.client_conversation_messages (
    organization_id, conversation_id, sender_client_id, sender_user_id, body, visibility, message_type
  ) VALUES (v_org_id, p_conversation_id, v_client_id, NULL, v_body, 'client', 'message')
  RETURNING id INTO v_message_id;
  UPDATE public.client_conversations SET last_message_at = now(), updated_at = now()
  WHERE id = p_conversation_id AND client_id = v_client_id;
  RETURN v_message_id;
END;
$$;
REVOKE ALL ON FUNCTION public.send_client_support_message(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.send_client_support_message(uuid, text) TO authenticated;
