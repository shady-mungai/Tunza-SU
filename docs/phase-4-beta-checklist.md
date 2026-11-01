# Phase 4 beta release checklist

This board separates repository proof from evidence that must come from the
deployed services, devices, and store accounts.

## Verified in the repository

- [x] Optional client/server crash reporting with release/environment labels.
- [x] Structured server logs, request identifiers, `/health`, and database-aware
  `/ready` endpoints.
- [x] Separate preview and production application identifiers, EAS profiles,
  channels, and guarded manual beta workflow.
- [x] Release validation blocks non-HTTPS API, support, and privacy URLs and
  incomplete OAuth/EAS configuration.
- [x] Final app icon, adaptive icon, splash mark, favicon, vector navigation,
  accessibility labels, and minimum touch targets.
- [x] Privacy, support, data-safety, store-listing, beta, and operations drafts.
- [x] Node 22 clean-install checks cover API tests, release configuration, Expo
  Doctor, native prebuild, and Android/iOS/web exports.

## Deployment evidence required

- [ ] Name the operating organization and approve its final privacy/retention
  terms and support contacts.
- [ ] Rotate historical secrets and provision least-privilege staging MySQL,
  private object storage, SMTP, OAuth, monitoring, and Expo credentials.
- [ ] Restore-test a staging backup, run migrations, and record the result.
- [ ] Deploy the API behind HTTPS and capture `/health`, `/ready`, log, email,
  private-image, and rollback evidence.
- [ ] Link the intended EAS project and configure preview/production variables.
- [ ] Build signed Android and iOS preview artifacts from the candidate commit.
- [ ] Complete the beta pilot on at least one physical Android device and one
  physical iPhone.
- [ ] Publish screenshots made from the approved preview build and finalize
  store privacy/data-safety/age-rating forms.
- [ ] Complete Play closed testing and TestFlight internal testing.
- [ ] Promote only after the product, operations, security, and privacy owners
  approve the recorded evidence.

An unchecked external item is not a source-code failure, but it is a release
gate. Do not describe the app as deployed, beta-tested, approved, or shipped
until the corresponding evidence exists.
