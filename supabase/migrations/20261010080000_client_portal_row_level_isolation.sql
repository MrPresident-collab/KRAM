-- Client portal isolation: clients only access records explicitly linked to their own active client record.
-- Internal Admin/Ops policies remain in place; these policies add narrowly scoped client access.

create or replace function public.current_kram_client_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select c.id
  from public.clients c
  where c.profile_id = (select auth.uid())
    and c.status = 'active'
  order by c.created_at asc
  limit 1;
$$;

revoke all on function public.current_kram_client_id() from public;
grant execute on function public.current_kram_client_id() to authenticated;

drop policy if exists "clients can view their own assets" on public.assets;
create policy "clients can view their own assets"
on public.assets for select to authenticated
using (client_id = (select public.current_kram_client_id()));

drop policy if exists "clients can view their own conversations" on public.client_conversations;
create policy "clients can view their own conversations"
on public.client_conversations for select to authenticated
using (client_id = (select public.current_kram_client_id()));

drop policy if exists "clients can start their own support conversations" on public.client_conversations;
create policy "clients can start their own support conversations"
on public.client_conversations for insert to authenticated
with check (
  client_id = (select public.current_kram_client_id())
  and exists (
    select 1 from public.clients c
    where c.id = client_conversations.client_id
      and c.organization_id = client_conversations.organization_id
      and c.profile_id = (select auth.uid())
      and c.status = 'active'
  )
  and (asset_id is null or exists (
    select 1 from public.assets a
    where a.id = client_conversations.asset_id
      and a.client_id = client_conversations.client_id
      and a.organization_id = client_conversations.organization_id
  ))
  and work_order_id is null and inspection_id is null and project_id is null
);

drop policy if exists "clients can view their own conversation messages" on public.client_conversation_messages;
create policy "clients can view their own conversation messages"
on public.client_conversation_messages for select to authenticated
using (
  visibility = 'client'
  and exists (
    select 1 from public.client_conversations c
    where c.id = client_conversation_messages.conversation_id
      and c.organization_id = client_conversation_messages.organization_id
      and c.client_id = (select public.current_kram_client_id())
  )
);

drop policy if exists "clients can send messages in their own conversations" on public.client_conversation_messages;
create policy "clients can send messages in their own conversations"
on public.client_conversation_messages for insert to authenticated
with check (
  sender_client_id = (select public.current_kram_client_id())
  and sender_user_id is null
  and visibility = 'client'
  and message_type = 'message'
  and exists (
    select 1 from public.client_conversations c
    where c.id = client_conversation_messages.conversation_id
      and c.organization_id = client_conversation_messages.organization_id
      and c.client_id = (select public.current_kram_client_id())
  )
);

drop policy if exists "clients can view explicitly shared documents" on public.documents;
create policy "clients can view explicitly shared documents"
on public.documents for select to authenticated
using (
  client_id = (select public.current_kram_client_id())
  and exists (
    select 1 from public.clients c
    where c.id = documents.client_id
      and c.organization_id = documents.organization_id
      and c.profile_id = (select auth.uid())
      and c.status = 'active'
  )
  and (asset_id is null or exists (
    select 1 from public.assets a
    where a.id = documents.asset_id
      and a.client_id = documents.client_id
      and a.organization_id = documents.organization_id
  ))
  and (conversation_id is null or exists (
    select 1 from public.client_conversations cc
    where cc.id = documents.conversation_id
      and cc.client_id = documents.client_id
      and cc.organization_id = documents.organization_id
  ))
);

drop policy if exists "clients can view published reports for their assets" on public.reports;
create policy "clients can view published reports for their assets"
on public.reports for select to authenticated
using (
  status = 'published' and deleted_at is null and asset_id is not null
  and exists (
    select 1 from public.assets a
    join public.clients c on c.id = a.client_id
    where a.id = reports.asset_id
      and a.client_id = (select public.current_kram_client_id())
      and a.organization_id = reports.organization_id
      and c.profile_id = (select auth.uid())
      and c.status = 'active'
  )
);

-- Client access to internal events, expenses, approvals, work-order notes, project notes,
-- and staff notifications is deliberately not granted by this migration.
