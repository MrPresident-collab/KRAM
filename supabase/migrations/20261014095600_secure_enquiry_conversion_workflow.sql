-- Secure enquiry workflow: status/assignment RPCs and atomic conversion.
alter table public.clients drop constraint if exists clients_status_check;
alter table public.clients add constraint clients_status_check
  check (status in ('pending_onboarding','active','deactivated','archived'));

create or replace function public.update_client_enquiry_status(p_enquiry_id uuid, p_status text)
returns boolean
language plpgsql security definer set search_path = ''
as $$
declare v_org uuid; v_converted uuid; v_uid uuid := auth.uid();
begin
  if p_status not in ('new','reviewing','contacted','qualified','declined','converted') then
    raise exception 'Invalid enquiry status';
  end if;
  select organization_id, converted_client_id into v_org, v_converted
    from public.client_enquiries where id = p_enquiry_id;
  if v_org is null or not public.has_org_role(v_org, array['owner','admin','regional_admin','support','operations']::public.app_role[]) then
    raise exception 'Not authorized';
  end if;
  if p_status = 'converted' and v_converted is null then
    raise exception 'Convert the enquiry to a client before changing its status to converted';
  end if;
  if p_status <> 'converted' and v_converted is not null then
    raise exception 'A converted enquiry cannot be moved back to an intake status';
  end if;
  update public.client_enquiries
    set status=p_status, reviewed_by=v_uid, reviewed_at=now(), updated_at=now()
    where id=p_enquiry_id;
  return found;
end;
$$;

create or replace function public.assign_client_enquiry(p_enquiry_id uuid, p_assigned_to uuid)
returns boolean
language plpgsql security definer set search_path = ''
as $$
declare v_org uuid;
begin
  select organization_id into v_org from public.client_enquiries where id=p_enquiry_id;
  if v_org is null or not public.has_org_role(v_org,array['owner','admin','regional_admin','support']::public.app_role[]) then
    raise exception 'Not authorized';
  end if;
  if p_assigned_to is not null and not exists (
    select 1 from public.organization_members m
    where m.organization_id=v_org and m.user_id=p_assigned_to and m.status='active'
      and m.role=any(array['owner','admin','regional_admin','support']::public.app_role[])
  ) then raise exception 'Assignee must be an active support team member'; end if;
  update public.client_enquiries set assigned_to=p_assigned_to,updated_at=now() where id=p_enquiry_id;
  return found;
end;
$$;

create or replace function public.convert_client_enquiry(
  p_enquiry_id uuid,
  p_existing_client_id uuid default null,
  p_branch_id uuid default null
) returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_enquiry public.client_enquiries%rowtype;
  v_client_id uuid;
  v_uid uuid := auth.uid();
  v_branch public.branches%rowtype;
  v_client public.clients%rowtype;
begin
  select * into v_enquiry from public.client_enquiries where id=p_enquiry_id for update;
  if not found then raise exception 'Enquiry not found'; end if;
  if not public.has_org_role(v_enquiry.organization_id,array['owner','admin','regional_admin']::public.app_role[]) then
    raise exception 'Only authorised administrators can convert enquiries';
  end if;
  if v_enquiry.converted_client_id is not null or v_enquiry.status='converted' then
    raise exception 'This enquiry has already been converted';
  end if;

  if p_existing_client_id is not null then
    select * into v_client from public.clients
      where id=p_existing_client_id and organization_id=v_enquiry.organization_id;
    if not found then raise exception 'Select a client within this KRAM organisation'; end if;
    if v_client.status in ('deactivated','archived') then raise exception 'Archived or deactivated clients cannot be linked'; end if;
    if v_client.branch_id is not null and not public.has_scoped_role(v_enquiry.organization_id,v_client.branch_id,array['owner','admin','regional_admin']::public.app_role[]) then
      raise exception 'Client is outside your branch scope';
    end if;
    v_client_id := v_client.id;
  else
    if p_branch_id is null then raise exception 'Choose the responsible branch before creating a client'; end if;
    select * into v_branch from public.branches
      where id=p_branch_id and organization_id=v_enquiry.organization_id and is_active=true;
    if not found then raise exception 'Choose a valid active branch'; end if;
    if not public.has_scoped_role(v_enquiry.organization_id,p_branch_id,array['owner','admin','regional_admin']::public.app_role[]) then
      raise exception 'Branch is outside your scope';
    end if;
    insert into public.clients(
      organization_id,branch_id,full_name,email,primary_phone,residency_country,residency_city,
      preferred_language,preferred_contact_method,notes,status,profile_id
    ) values (
      v_enquiry.organization_id,p_branch_id,v_enquiry.full_name,v_enquiry.email,v_enquiry.phone,
      nullif(split_part(v_enquiry.residence,',',2),''),nullif(split_part(v_enquiry.residence,',',1),''),
      v_enquiry.preferred_language,v_enquiry.preferred_contact,
      concat('Created from enquiry ',v_enquiry.id::text,E'\nOriginal enquiry details: ',coalesce(v_enquiry.details,''),E'\nRequested assets/services remain recorded on the original enquiry.'),
      'pending_onboarding',null
    ) returning id into v_client_id;
  end if;

  update public.client_enquiries set converted_client_id=v_client_id,status='converted',
    reviewed_by=v_uid,reviewed_at=now(),updated_at=now()
    where id=p_enquiry_id and converted_client_id is null;
  if not found then raise exception 'Enquiry was converted by another user; refresh and try again'; end if;
  return v_client_id;
end;
$$;

revoke all on function public.update_client_enquiry_status(uuid,text) from public;
revoke all on function public.assign_client_enquiry(uuid,uuid) from public;
revoke all on function public.convert_client_enquiry(uuid,uuid,uuid) from public;
grant execute on function public.update_client_enquiry_status(uuid,text) to authenticated;
grant execute on function public.assign_client_enquiry(uuid,uuid) to authenticated;
grant execute on function public.convert_client_enquiry(uuid,uuid,uuid) to authenticated;
