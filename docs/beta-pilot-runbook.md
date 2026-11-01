# Tunza SU beta pilot runbook

## Entry criteria

- The candidate commit is tagged and the branch is clean.
- API tests, release-config tests, Expo Doctor, native prebuilds, and Android,
  iOS, and web exports pass on Node 22.
- A backed-up staging database is migrated and `/health` and `/ready` succeed
  through HTTPS.
- Preview environment values include the API, OAuth clients, EAS identity,
  support URL, privacy URL, and optional crash-monitoring DSN.
- A dedicated test administrator, maintenance account, and student account
  exist; none is a production account.
- Privacy, support, data-safety, and store-copy drafts have owner approval.

## Cohort

Start with the product owner plus one administrator, two maintenance users, and
three to five student testers. Add people only after the first full workflow
passes. Keep TestFlight and Play Console groups private.

## Required scenarios

1. Install, launch, sign in, restore a session after restart, and sign out.
2. Register a student and confirm that public registration cannot choose a
   privileged role.
3. Submit reports with no image, a camera image, and a library image.
4. Reject an unsupported/oversized image without losing the form.
5. Assign a report to maintenance staff; verify another staff member cannot
   change it.
6. Progress the report through canonical states and verify the student view.
7. Confirm new-report and resolution email delivery.
8. Disable/change an account and verify its existing session loses access.
9. Exercise offline, slow-network, expired-session, and API-error states.
10. Open support and privacy links from the installed app.

Record device model, OS, build number, scenario, result, evidence link, and
issue identifier. Never put real personal or facilities-security data in beta
evidence.

## Exit criteria

- No unresolved critical/high security or data-loss issue.
- No blocker in registration, login, report submission, assignment, status
  update, or logout on at least one supported Android device and iPhone.
- Crash-free sessions and API error rates are reviewed for the pilot period.
- Backup restore, rollback, support intake, and incident contacts are tested.
- Store disclosures match the deployed providers and behavior.

## Rollback and incident response

Pause invitations and submissions, preserve request identifiers and timestamps,
disable the affected release/channel when appropriate, roll the API back to the
last compatible image, and restore data only from a validated backup. Notify
the operator's security/privacy owner if personal data may be involved. Record
the decision, impact, remediation, and retest evidence before resuming.
