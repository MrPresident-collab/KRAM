-- Keep conversation access tied to the same organization on both sides of each relation.
-- This migration mirrors the corrected policies applied to the active Supabase project.

drop policy if exists "authorized staff can create conversation messages" on public.client_conversation_messages;
create policy "authorized staff can create conversation messages"
on public.client_conversation_messages
for insert
to authenticated
with check (
  sender_user_id = (select auth.uid())
  and exists (
    select 1
    from public.client_conversations c
    where c.id = client_conversation_messages.conversation_id
      and c.organization_id = client_conversation_messages.organization_id
      and public.can_access_client(c.organization_id, c.client_id)
  )
);

drop policy if exists "authorized staff can view conversation messages" on public.client_conversation_messages;
create policy "authorized staff can view conversation messages"
on public.client_conversation_messages
for select
to authenticated
using (
  exists (
    select 1
    from public.client_conversations c
    where c.id = client_conversation_messages.conversation_id
      and c.organization_id = client_conversation_messages.organization_id
      and public.can_access_client(c.organization_id, c.client_id)
  )
);

drop policy if exists "authorized staff can create client conversations" on public.client_conversations;
create policy "authorized staff can create client conversations"
on public.client_conversations
for insert
to authenticated
with check (
  public.can_access_client(organization_id, client_id)
  and exists (
    select 1
    from public.organization_members om
    where om.organization_id = client_conversations.organization_id
      and om.user_id = (select auth.uid())
      and om.status = 'active'
  )
);

-- RLS controls which rows staff can access; SQL privileges must also allow
-- authenticated users to issue these operations through the Data API.
grant select, insert, update on table public.client_conversations to authenticated;
grant select, insert on table public.client_conversation_messages to authenticated;
