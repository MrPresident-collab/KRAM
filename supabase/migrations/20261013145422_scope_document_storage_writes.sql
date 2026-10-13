-- Enforce role and geographic scope consistently for document writes.
-- A member must be active, hold an authorized operational role, and have
-- scope over the exact organization/branch path in the storage object name.
DROP POLICY IF EXISTS "KRAM operators can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "KRAM operators can update documents" ON storage.objects;
DROP POLICY IF EXISTS "KRAM administrators can delete documents" ON storage.objects;

CREATE POLICY "KRAM operators can upload documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'kram-documents'
  AND EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.user_id = (SELECT auth.uid())
      AND om.status = 'active'
      AND om.organization_id = ((storage.foldername(name))[1])::uuid
      AND om.role = ANY (ARRAY['owner'::public.app_role,'admin'::public.app_role,'regional_admin'::public.app_role,'operations'::public.app_role,'finance'::public.app_role])
      AND (
        om.scope_level = 'global'::public.access_scope_level
        OR (
          om.scope_level = 'country'::public.access_scope_level
          AND CASE
            WHEN (storage.foldername(name))[2] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
            THEN (storage.foldername(name))[2]::uuid IN (
              SELECT b.id FROM public.branches b
              WHERE b.organization_id = om.organization_id AND b.country_id = om.country_id
            )
            ELSE false
          END
        )
        OR (
          om.scope_level = 'branch'::public.access_scope_level
          AND CASE
            WHEN (storage.foldername(name))[2] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
            THEN (storage.foldername(name))[2]::uuid = om.branch_id
            ELSE false
          END
        )
      )
  )
);

CREATE POLICY "KRAM operators can update documents"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'kram-documents'
  AND EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.user_id = (SELECT auth.uid())
      AND om.status = 'active'
      AND om.organization_id = ((storage.foldername(name))[1])::uuid
      AND om.role = ANY (ARRAY['owner'::public.app_role,'admin'::public.app_role,'regional_admin'::public.app_role,'operations'::public.app_role,'finance'::public.app_role])
      AND (
        om.scope_level = 'global'::public.access_scope_level
        OR (
          om.scope_level = 'country'::public.access_scope_level
          AND CASE
            WHEN (storage.foldername(name))[2] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
            THEN (storage.foldername(name))[2]::uuid IN (
              SELECT b.id FROM public.branches b
              WHERE b.organization_id = om.organization_id AND b.country_id = om.country_id
            )
            ELSE false
          END
        )
        OR (
          om.scope_level = 'branch'::public.access_scope_level
          AND CASE
            WHEN (storage.foldername(name))[2] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
            THEN (storage.foldername(name))[2]::uuid = om.branch_id
            ELSE false
          END
        )
      )
  )
)
WITH CHECK (
  bucket_id = 'kram-documents'
  AND EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.user_id = (SELECT auth.uid())
      AND om.status = 'active'
      AND om.organization_id = ((storage.foldername(name))[1])::uuid
      AND om.role = ANY (ARRAY['owner'::public.app_role,'admin'::public.app_role,'regional_admin'::public.app_role,'operations'::public.app_role,'finance'::public.app_role])
      AND (
        om.scope_level = 'global'::public.access_scope_level
        OR (
          om.scope_level = 'country'::public.access_scope_level
          AND CASE
            WHEN (storage.foldername(name))[2] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
            THEN (storage.foldername(name))[2]::uuid IN (
              SELECT b.id FROM public.branches b
              WHERE b.organization_id = om.organization_id AND b.country_id = om.country_id
            )
            ELSE false
          END
        )
        OR (
          om.scope_level = 'branch'::public.access_scope_level
          AND CASE
            WHEN (storage.foldername(name))[2] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
            THEN (storage.foldername(name))[2]::uuid = om.branch_id
            ELSE false
          END
        )
      )
  )
);

CREATE POLICY "KRAM administrators can delete documents"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'kram-documents'
  AND EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.user_id = (SELECT auth.uid())
      AND om.status = 'active'
      AND om.organization_id = ((storage.foldername(name))[1])::uuid
      AND om.role = ANY (ARRAY['owner'::public.app_role,'admin'::public.app_role,'regional_admin'::public.app_role])
      AND (
        om.scope_level = 'global'::public.access_scope_level
        OR (
          om.scope_level = 'country'::public.access_scope_level
          AND CASE
            WHEN (storage.foldername(name))[2] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
            THEN (storage.foldername(name))[2]::uuid IN (
              SELECT b.id FROM public.branches b
              WHERE b.organization_id = om.organization_id AND b.country_id = om.country_id
            )
            ELSE false
          END
        )
        OR (
          om.scope_level = 'branch'::public.access_scope_level
          AND CASE
            WHEN (storage.foldername(name))[2] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
            THEN (storage.foldername(name))[2]::uuid = om.branch_id
            ELSE false
          END
        )
      )
  )
);