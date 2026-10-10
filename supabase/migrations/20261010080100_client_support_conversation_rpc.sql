-- Create a client support conversation and its first client-visible message atomically.
create or replace function public.start_client_support_conversation(
  p_subject text,
  p_body text,
  p_asset_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_client public.clients%rowtype;
  v_conversation_id uuid;
begin
  select c.* into v_client
  from public.clients c
  where c.profile_id = auth.uid() and c.status = 'active'
  order by c.created_at asc limit 1;

  if v_client.id is null then
    raise exception 'No active client account is linked to this login';
  end if;
  if length(trim(coalesce(p_body, ''))) < 2 or length(p_body) > 5000 then
    raise exception 'Please provide a message of between 2 and 5000 characters';
  end if;
  if p_subject is not null and length(p_subject) > 180 then
    raise exception 'Subject is too long';
  end if;
  if p_asset_id is not null and not exists (
    select 1 from public.assets a where a.id = p_asset_id
      and a.client_id = v_client.id and a.organization_id = v_client.organization_id
  ) then
    raise exception 'Selected asset is not linked to this client';
  end if;

  insert into public.client_conversations (
    organization_id, client_id, subject, channel, status, priority, asset_id, created_by
  ) values (
    v_client.organization_id, v_client.id, nullif(trim(coalesce(p_subject, '')), ''),
    'portal', 'open', 'normal', p_asset_id, auth.uid()
  ) returning id into v_conversation_id;

  insert into public.client_conversation_messages (
    organization_id, conversation_id, sender_user_id, sender_client_id, body, visibility, message_type
  ) values (
    v_client.organization_id, v_conversation_id, null, v_client.id, trim(p_body), 'client', 'message'
  );

  update public.client_conversations
  set last_message_at = now(), updated_at = now()
  where id = v_conversation_id;

  return v_conversation_id;
end;
$$;

revoke all on function public.start_client_support_conversation(text, text, uuid) from public;
grant execute on function public.start_client_support_conversation(text, text, uuid) to authenticated;
