# Tunza SU operations runbook

## Staging release

1. Record the candidate commit and image digest.
2. Back up MySQL and verify the backup can be restored in an isolated database.
3. Run `npm ci`, `npm run check`, and `npm run migrate` from `server`.
4. Confirm all migrations are present in `schema_migrations`.
5. Deploy `server/Dockerfile` behind HTTPS with exact CORS origins, a generated
   JWT secret, trusted-proxy settings, OAuth audiences, private object storage,
   email, and optional Sentry settings.
6. Confirm `/health` shows that the process is running and `/ready` proves the
   database is reachable before directing traffic to the candidate.
7. Run the beta scenarios and review structured logs by request identifier.

Never print or commit secrets. Keep the database, object-storage, SMTP, Expo,
and monitoring credentials in the provider's secret store, separated by
environment and limited to the permissions required.

## Monitoring

Alert on readiness failure, elevated 5xx responses, authentication abuse,
storage/email failures, and unusual latency. Configure release and environment
labels. Keep sampling and log retention proportional, and avoid copying report
content or identity fields into diagnostic events.

## Rollback

Keep the prior API image and mobile channel available. Roll back application
code only when its database expectations remain compatible. Forward-only
database correction is usually safer than reversing a migration after new data
has been written. Record the incident window and validate login, report reads,
and a new report after rollback.

## Recovery

Exercise database and private-image recovery before the pilot. Document recovery
point and recovery time objectives, backup frequency, encryption, access,
retention, and restoration owner. A backup that has not been restored in a test
does not count as recovery evidence.

## Key rotation and offboarding

Rotate exposed or departing-user credentials immediately. Update the provider
secret, deploy/restart affected services, revoke the old credential, and verify
normal operation. Remove staff access from source control, hosting, stores,
Expo, database, storage, email, and monitoring independently.
