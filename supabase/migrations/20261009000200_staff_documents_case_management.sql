create table if not exists public.staff_directory (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  full_name text not null check (char_length(trim(full_name)) between 2 and 160),
  work_email text,
  job_title text not null check (char_length(trim(job_title)) between 2 and 160),
  role public.app_role not null default 'viewer',
  scope_level public.access_scope_level not null default 'branch',
  country_id uuid references public.countries(id) on delete set null,
  branch_id uuid references public.branches(id) on delete set null,
  status text not null default 'pending_invitation' check (status in ('pending_invitation','invited','active','inactive')),
  auth_user_id uuid references auth.users(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint staff_directory_scope_consistency check (
    (scope_level = 'global' and country_id is null and branch_id is null)
    or (scope_level = 'country' and country_id is not null and branch_id is null)
    or (scope_level = 'branch' and branch_id is not null)
  )
);
create index if not exists staff_directory_org_created_idx on public.staff_directory (organization_id, created_at desc);
create index if not exists staff_directory_org_status_idx on public.staff_directory (organization_id, status);
alter table public.staff_directory enable row level security;
drop policy if exists "Members can view staff directory" on public.staff_directory;
create policy "Members can view staff directory" on public.staff_directory for select to authenticated using (public.is_org_member(organization_id));
drop policy if exists "Admins can manage staff directory" on public.staff_directory;
create policy "Admins can manage staff directory" on public.staff_directory for all to authenticated using (public.has_org_role(organization_id, array['owner'::public.app_role,'admin'::public.app_role,'regional_admin'::public.app_role])) with check (public.has_org_role(organization_id, array['owner'::public.app_role,'admin'::public.app_role,'regional_admin'::public.app_role]));
alter table public.documents add column if not exists description text;
alter table public.documents add column if not exists client_id uuid references public.clients(id) on delete set null;
alter table public.documents add column if not exists conversation_id uuid references public.client_conversations(id) on delete set null;
create index if not exists documents_org_conversation_idx on public.documents (organization_id, conversation_id) where conversation_id is not null;
alter table public.client_conversations add column if not exists assigned_to uuid references auth.users(id) on delete set null;
alter table public.client_conversations add column if not exists case_status text not null default 'open';
alter table public.client_conversations add column if not exists escalated_by uuid references auth.users(id) on delete set null;
alter table public.client_conversations add column if not exists escalated_to uuid references auth.users(id) on delete set null;
alter table public.client_conversations add column if not exists escalation_reason text;
alter table public.client_conversations add column if not exists resolution_summary text;
alter table public.client_conversations add column if not exists resolved_by uuid references auth.users(id) on delete set null;
alter table public.client_conversations add column if not exists resolved_at timestamptz;
alter table public.client_conversations add column if not exists closed_by uuid references auth.users(id) on delete set null;
alter table public.client_conversations add column if not exists closed_at timestamptz;
alter table public.client_conversations add column if not exists last_action_summary text;
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'client_conversations_case_status_check') then
    alter table public.client_conversations add constraint client_conversations_case_status_check check (case_status in ('open','assigned','in_progress','escalated','resolved','closed'));
  end if;
end $$;
create index if not exists client_conversations_org_case_status_idx on public.client_conversations (organization_id, case_status, updated_at desc);
update storage.buckets set file_size_limit = 20971520, allowed_mime_types = array['application/pdf','image/jpeg','image/png','image/webp','text/plain','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'] where id = 'kram-documents';
drop policy if exists "KRAM members can read organization documents" on storage.objects;
create policy "KRAM members can read organization documents" on storage.objects for select to authenticated using (bucket_id = 'kram-documents' and public.is_org_member(((storage.foldername(name))[1])::uuid));
drop policy if exists "KRAM operators can upload organization documents" on storage.objects;
create policy "KRAM operators can upload organization documents" on storage.objects for insert to authenticated with check (bucket_id = 'kram-documents' and public.has_org_role(((storage.foldername(name))[1])::uuid, array['owner'::public.app_role,'admin'::public.app_role,'regional_admin'::public.app_role,'operations'::public.app_role,'finance'::public.app_role]));
drop policy if exists "KRAM operators can delete organization documents" on storage.objects;
create policy "KRAM operators can delete organization documents" on storage.objects for delete to authenticated using (bucket_id = 'kram-documents' and public.has_org_role(((storage.foldername(name))[1])::uuid, array['owner'::public.app_role,'admin'::public.app_role,'regional_admin'::public.app_role,'operations'::public.app_role,'finance'::public.app_role]));
