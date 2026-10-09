create table if not exists public.client_conversation_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  conversation_id uuid not null references public.client_conversations(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  event_type text not null check (event_type in ('created','assigned','status_changed','escalated','action_recorded','resolved','reopened','closed')),
  from_status text,
  to_status text,
  details text,
  assigned_to uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists conversation_events_case_time_idx on public.client_conversation_events (organization_id,conversation_id,created_at desc);
alter table public.client_conversation_events enable row level security;
drop policy if exists "Staff can view case events" on public.client_conversation_events;
create policy "Staff can view case events" on public.client_conversation_events for select to authenticated using (
  exists(select 1 from public.client_conversations c where c.id=conversation_id and c.organization_id=client_conversation_events.organization_id and public.can_access_client(c.organization_id,c.client_id))
);
drop policy if exists "Staff can create case events" on public.client_conversation_events;
create policy "Staff can create case events" on public.client_conversation_events for insert to authenticated with check (
  actor_id = auth.uid() and exists(select 1 from public.organization_members om where om.user_id=auth.uid() and om.organization_id=client_conversation_events.organization_id and om.status='active')
  and exists(select 1 from public.client_conversations c where c.id=conversation_id and c.organization_id=client_conversation_events.organization_id and public.can_access_client(c.organization_id,c.client_id))
);
grant select,insert on public.client_conversation_events to authenticated;
