# Phase 3 release checklist

This checklist separates source-level readiness from proof that a staging or
store release is working. Check an item only after verifying it in the named
environment.

## Accounts and secrets

- [ ] Rotate every database, OAuth, Expo, and email credential that appeared in
  the old repository history.
- [ ] Create the intended Expo organization/project and run `eas init` from
  `client`.
- [ ] Create separate Google OAuth clients for Android, iOS, and web, and add
  their client IDs to both the mobile and API environments.
- [ ] Select an SMTP provider and an S3-compatible private bucket.

## Staging API

- [ ] Provision a backed-up MySQL 8 database with a least-privilege application
  user.
- [ ] Configure a 32-byte-or-longer JWT secret, exact CORS origins, trusted proxy
  behavior, Google audiences, SMTP, and S3 settings.
- [ ] Back up the database, run `npm run migrate`, and confirm all three
  migrations in `schema_migrations`.
- [ ] Run `npm run create-admin` once with a unique administrator identity.
- [ ] Deploy `server/Dockerfile` behind HTTPS and confirm `/health` returns 200.
- [ ] Confirm uploads are private and returned image URLs expire or use the
  intended CDN policy.

## End-to-end acceptance

- [ ] A student can register, sign in again, restore a session, and sign out.
- [ ] Google sign-in works only for the configured audiences/domain.
- [ ] A student can submit a report with and without a supported image.
- [ ] An administrator can assign the report only to maintenance staff.
- [ ] Assigned maintenance staff can update the report; unassigned staff cannot.
- [ ] The student can see canonical pending, in-progress, resolved, and rejected
  states.
- [ ] New-report and resolution emails arrive from the configured backend sender.
- [ ] Role changes and account deletion invalidate existing access immediately.

## Preview and store release

- [ ] Set `EXPO_PUBLIC_API_URL` to the staging HTTPS endpoint and build an EAS
  preview for both Android and iOS.
- [ ] Complete device testing on at least one physical Android device and one
  physical iPhone.
- [ ] Add final app icon, splash screen, screenshots, support URL, privacy policy,
  data-safety answers, age rating, and store descriptions.
- [ ] Confirm camera/photo permission wording matches actual use.
- [ ] Complete Play closed testing and TestFlight internal testing.
- [ ] Promote a production build only after staging data, logs, backups, email,
  and image storage have been reviewed.

## Current proof boundary

The repository can prove dependency installation, static checks, JavaScript
exports, API integration tests, and disposable-MySQL migrations. It cannot prove
credential rotation, hosted HTTPS, real SMTP/S3 delivery, physical-device
behavior, signing credentials, or store approval until those external steps are
completed.

The API audit is clean. The mobile audit currently reports moderate
`glob`/`minimatch` findings through Expo's build-tool dependency graph, with no
compatible non-breaking fix proposed by npm; no high or critical advisory is
present. Do not apply npm's forced Expo downgrade. Recheck the advisories before
each release.
