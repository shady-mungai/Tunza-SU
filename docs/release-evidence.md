# Phase 4 release evidence

**Recorded:** 2 November 2026

**Branch:** `release/phase-4-beta`

**Evidence scope:** source, clean build environment, and disposable local
production containers. This is not evidence of a hosted deployment, signed EAS
artifact, physical-device pilot, TestFlight review, or Play closed test.

## Staged delivery

| Commit | Milestone |
| --- | --- |
| `85e3618` | Production readiness, structured logs, health/readiness, optional Sentry |
| `20f54cf` | Preview/production identities, EAS profiles, environment validation |
| `856ed9a` | Guarded manual beta build workflow and CI release checks |
| `dda5a5d` | Release branding, vector navigation, accessibility improvements |
| `eb46835` | Privacy, support, store, operations, and pilot materials |

## Verified checks

- API syntax and integration suite: 23 of 23 tests passed on Node 22.
- Mobile release configuration: 7 of 7 tests passed on Node 22.
- Expo Doctor: 20 of 20 checks passed from a clean Continuous Native
  Generation checkout.
- Native generation completed for Android and iOS.
- Expo export completed for Android, iOS, and web.
- The production API Docker image built successfully from `server/Dockerfile`.
- MySQL 8 applied migrations `001`, `002`, and `003` to a disposable database.
- `/ready` returned HTTP 200 from the production container with the database
  connected.
- The database-backed release smoke script passed 11 checks: health,
  readiness, administrator login, student registration, restored-session
  validation, staff provisioning, report submission, student visibility,
  assignment, unassigned-staff denial, and assigned-staff resolution.
- Smoke cleanup left no disposable report and no disposable student or staff
  account; only the deliberately provisioned test administrator remained.
- Production dependency audits returned success at the high-severity threshold.
  Current findings are moderate transitive `glob`/`minimatch` advisories in
  Expo/Sentry build tooling; npm only proposes breaking forced changes, so no
  forced downgrade was applied.

The CI API job now repeats the database-backed smoke path against its MySQL 8
service after migrations and unit/integration tests.

## External release gates

- Expo CLI reported `Not logged in`; the intended EAS project cannot be linked
  and Android/iOS preview builds cannot be signed or queued from this
  environment.
- No Tunza SU hosting project or selected production database/object-storage/
  email providers were available. The API therefore has not been deployed
  behind public HTTPS.
- Google OAuth production clients, public privacy/support URLs, provider
  secrets, signing credentials, and store accounts were not available.
- Email delivery, private S3-compatible images, Sentry ingestion, backup
  restore, physical devices, screenshots, TestFlight, and Play closed testing
  still require their actual provider environments.
- The privacy notice still requires the operating organization's legal
  identity, approved retention periods, and monitored support contact.

## Promotion rule

Keep the branch as a release candidate until every external item in
`docs/phase-4-beta-checklist.md` has recorded evidence. A green source/CI check
does not authorize describing the app as deployed, beta-tested, store-approved,
or shipped.
