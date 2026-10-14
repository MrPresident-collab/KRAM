-- Emit a separate audit event for each enquiry workflow change in a single update.
create or replace function public.log_client_enquiry_workflow_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status is distinct from old.status then
    insert into public.audit_logs (
      organization_id, branch_id, actor_id, action, entity_type, entity_id, summary, metadata
    ) values (
      new.organization_id, null, auth.uid(), 'client_enquiry_status_changed', 'client_enquiry', new.id,
      'Client enquiry status changed from ' || old.status || ' to ' || new.status || '.',
      jsonb_build_object('from_status', old.status, 'to_status', new.status)
    );
  end if;

  if new.assigned_to is distinct from old.assigned_to then
    insert into public.audit_logs (
      organization_id, branch_id, actor_id, action, entity_type, entity_id, summary, metadata
    ) values (
      new.organization_id, null, auth.uid(), 'client_enquiry_assignment_changed', 'client_enquiry', new.id,
      'Client enquiry support assignment changed.',
      jsonb_build_object('previous_assignee_id', old.assigned_to, 'assignee_id', new.assigned_to)
    );
  end if;

  if new.converted_client_id is distinct from old.converted_client_id and new.converted_client_id is not null then
    insert into public.audit_logs (
      organization_id, branch_id, actor_id, action, entity_type, entity_id, summary, metadata
    ) values (
      new.organization_id, null, auth.uid(), 'client_enquiry_converted', 'client_enquiry', new.id,
      'Client enquiry converted and linked to a client record.',
      jsonb_build_object('client_id', new.converted_client_id)
    );
  end if;

  return new;
end;
$$;
