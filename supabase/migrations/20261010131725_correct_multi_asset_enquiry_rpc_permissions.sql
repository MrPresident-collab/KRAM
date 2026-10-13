-- Explicitly restrict the multi-asset public enquiry RPC to the intended API roles.
REVOKE ALL ON FUNCTION public.submit_public_client_enquiry(text, text, text, text, text, text, text[], text, text, text, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_public_client_enquiry(text, text, text, text, text, text, text[], text, text, text, jsonb) TO anon, authenticated;
