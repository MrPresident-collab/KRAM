create or replace function public.can_manage_country(target_org uuid, target_country uuid default null)
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = target_org
      and om.user_id = (select auth.uid())
      and om.status = 'active'
      and om.role = 'owner'
      and om.scope_level = 'global'
  )
  and (
    target_country is null
    or exists (
      select 1
      from public.countries c
      where c.id = target_country
        and c.organization_id = target_org
    )
  );
$function$;

comment on function public.can_manage_country(uuid, uuid) is
  'Allows only an active global owner to manage organisational geography. The legacy country field is retained; its business meaning is a KRAM-defined region, not necessarily a sovereign country.';

