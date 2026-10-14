-- Record status, assignment, and conversion changes to the original client enquiry.
-- This keeps the intake history even after the enquiry is linked to a client.
create or replace function public.log_client_enquiry_workflow_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_action text;
  v_summary text;
  v_metadata jsonb := '{}'::jsonb;
begin
  if new.status is distinct from old.status then
    v_action := 'client_enquiry_status_changed';
    v_summary := 'Client enquiry status changed from ' || old.status || ' to ' || new.status || '.';
    v_metadata := v_metadata || jsonb_build_object('from_status', old.status, 'to_status', new.status);
  end if;

  if new.assigned_to is distinct from old.assigned_to then
    v_action := 'client_enquiry_assignment_changed';
    v_summary := 'Client enquiry support assignment changed.';
    v_metadata := v_metadata || jsonb_build_object('previous_assignee_id', old.assigned_to, 'assignee_id', new.assigned_to);
  end if;

  if new.converted_client_id is distinct from old.converted_client_id and new.converted_client_id is not null then
    v_action := 'client_enquiry_converted';
    v_summary := 'Client enquiry converted and linked to a client record.';
    v_metadata := v_metadata || jsonb_build_object('client_id', new.converted_client_id);
  end if;

  if v_action is not null then
    insert into public.audit_logs (
      organization_id, branch_id, actor_id, action, entity_type, entity_id, summary, metadata
    ) values (
      new.organization_id, null, auth.uid(), v_action, 'client_enquiry', new.id, v_summary, v_metadata
    );
  end if;

  return new;
end;
$$;

drop trigger if exists client_enquiry_workflow_audit on public.client_enquiries;
create trigger client_enquiry_workflow_audit
after update of status, assigned_to, converted_client_id on public.client_enquiries
for each row execute function public.log_client_enquiry_workflow_change();
