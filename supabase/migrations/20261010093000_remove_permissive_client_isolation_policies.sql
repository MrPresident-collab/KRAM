-- Remove earlier policies that treated a missing client link as unrestricted.
-- Explicit client ownership policies and staff scope policies remain in place.
DROP POLICY IF EXISTS "client isolation assets select" ON public.assets;
DROP POLICY IF EXISTS "client isolation conversations select" ON public.client_conversations;
DROP POLICY IF EXISTS "client isolation messages select" ON public.client_conversation_messages;
DROP POLICY IF EXISTS "client isolation documents select" ON public.documents;
DROP POLICY IF EXISTS "client isolation reports select" ON public.reports;
