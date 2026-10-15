# KRAM Ops Permission & Workspace Matrix

Status: architecture baseline and enforcement target
Branch: `home-redesign`
Last reviewed: 2026-10-15

This document is the authority for permission work. A change is not complete merely because a page hides a button: the page loader, server action, database grants/RLS policy, and any storage policy must agree.

## 1. Non-negotiable scope model

The membership enum currently contains `global`, `country`, and `branch`. Keep these stored values for compatibility until a planned schema migration is approved; their business meaning is:

- **Global / Owner:** unrestricted organisational scope across the entire KRAM business: every region, country, city, branch, asset, client, and operational area. `global` membership is reserved for the owner unless the owner explicitly authorises another Global member in the future. Global scope is not a reason to bypass authentication, audit logging, or careful destructive-action safeguards.
- **Region / Regional Admin:** the existing `country` scope is a legacy database name. Its intended business meaning is a KRAM-defined **region**, which may group multiple countries, cities, and branches. A regional administrator may operate only inside their assigned region.
- **Branch / Admin:** `branch` scope confines the administrator to the assigned branch and its permitted operational functions.
- **Functional roles:** `operations`, `finance`, `support`, and `viewer` describe job responsibilities, not extra organisational reach. They remain confined to their assigned scope. `client` belongs to the client portal and must not receive staff Ops access.

Do not equate a region with a country. The current database has a `countries` table and `organization_members.country_id`; a first-class region entity and region-to-country/branch relationships must be designed before regional scope can be reliably enforced. Do not silently treat a country ID as a region ID.

## 2. Enforcement sequence (required for every protected action)

1. Authenticate the current user from the verified session.
2. Load the target record and its organisation and scope relationships from the database; never trust an organisation, region, branch, or role supplied by the browser.
3. Find an **active** membership for the same organisation. If multiple memberships are supported, resolve the relevant membership deterministically; do not select the oldest membership and assume it is the right one.
4. Enforce the scope boundary:
   - Global owner: all records in the organisation.
   - Regional Admin: records whose branch/country belongs to the assigned region.
   - Branch Admin: records belonging to the assigned branch.
   - Functional staff: same assigned scope, further restricted by their role's allowed actions.
5. Enforce the role/action matrix and record-state transition rules.
6. Enforce the same boundary in PostgreSQL RLS/grants and Storage policies. Server-side checks are not a replacement for database enforcement.
7. Write audit events for material changes, including actor, organisation, record, action, timestamp, and relevant before/after state.
8. Return a safe, actionable error; do not leak private record data in errors.

All steps must be checked on both reads and writes. Hiding navigation or a button is usability, not authorisation.

## 3. Role workspace target

Use one Ops application with role-specific dashboards and navigation, not duplicated apps. Each role should see the work queues, metrics, and actions it needs every day. A deep link must still be rejected by the server if unauthorised.

| Role | Default workspace emphasis | Must not imply |
|---|---|---|
| Global / Owner | Business-wide overview; region and branch setup; people and role assignment; cross-region operations; financial/operational oversight; escalations; audit activity and configuration | No organisational boundary, but not exemption from authentication or audit |
| Regional Admin | Assigned region's performance, branches, workload, staffing/assignments, exceptions and regional reporting | Access to other regions |
| Branch Admin | Assigned branch's assets, clients, enquiries, work orders, staff coordination and permitted local expenses/approvals | Access to other branches or region-wide administration |
| Operations | Assets, inspections, projects/work orders, service delivery and operational follow-ups within scope | Financial or user-administration access unless separately granted |
| Finance | Expenses, approvals/payment workflows and financial reports within scope | General operations or staff administration by default |
| Support | Client enquiries, conversations, service requests and follow-ups within scope | Access to internal financial records or unrelated operational data by default |
| Viewer | Read-only pages and records explicitly granted within scope | Any mutation or approval |
| Client | Client portal only, isolated to their linked client and authorised assets | Internal Ops access or another client's data |

The exact permitted actions (create/edit/assign/approve/pay/archive/restore/permanently delete/export) must be specified per module before implementation. Where an action is not explicitly granted, deny it by default.

## 4. Current implementation observations (verified snapshot)

- Database enums currently include roles: `owner`, `admin`, `operations`, `finance`, `support`, `viewer`, `client`, `regional_admin`; scopes: `global`, `country`, `branch`.
- `organization_members` has active/invited/deactivated/archived statuses and `country_id`/ `branch_id` foreign keys. The live membership summary currently returned one active `owner/global` membership, so real behaviour for every role cannot be verified using current production-like membership data alone.
- Ops layout selects the earliest active membership for a user and derives a workspace label from `country_id` or `branch_id`. This is not sufficient as a general multi-membership resolver and labels the legacy `country` scope as a country.
- Ops sidebar currently builds a common navigation list and displays all sections regardless of role. Role-specific navigation/workspaces are not yet consistently enforced in the UI.
- Countries and branches have create/update/delete actions restricted to active global-scope `owner` or `admin`. The intended model reserves Global scope for the owner; this needs to be reconciled so a branch admin cannot acquire global powers and only the owner can create/manage the organisational structure unless explicitly delegated.
- Some RLS policies use shared helpers such as `has_org_role`, `is_org_member`, and `can_access_branch`. Existing policy expressions and action-level checks vary by table/module and must be audited together rather than assumed consistent.
- Existing membership and role checks are not proof that all record reads, server actions, RLS policies, and Storage paths have equivalent scope enforcement.

## 5. Organisational setup requirement

Ops must provide a controlled way for the owner to configure:

1. Regions (name, code, status and other required metadata).
2. Countries associated with a region (a country belongs to the appropriate region according to the chosen business model).
3. Branches associated with a region and country, including city/address and active status.
4. Membership assignments to a region or branch with role and active status.
5. Validation preventing cross-organisation references and invalid combinations (e.g. a branch admin without a branch; regional admin without a region; global scope assigned without explicit owner authority).

The current `countries` table is not itself a region model. Before implementing this UI, design a migration for a first-class region entity and update membership references and policy helpers in one coordinated change. Preserve existing records with an explicit backfill/mapping plan.

## 6. Coordinated audit plan (no isolated patches)

1. Inventory every Ops route, data loader, server action, database table policy, function grant, and Storage policy.
2. Agree the complete action matrix for each module and record state.
3. Design the region/country/branch relationship and migrate it with a backfill.
4. Implement shared, tested permission helpers and deterministic membership resolution.
5. Apply the same scope/action rules to RLS, grants, RPCs and Storage.
6. Apply server action and page-loader enforcement.
7. Apply role-specific dashboards/navigation and empty states.
8. Test each role across allowed and denied reads/writes, including direct URLs, forged IDs, cross-region/branch records, inactive memberships, and record-state edge cases.
9. Verify database policies and function grants in the live project; run automated tests/build; only then deploy.

Do not claim the hierarchy is fully enforced until the matrix, database policies, server actions, direct-route checks, and role-based tests all pass.
