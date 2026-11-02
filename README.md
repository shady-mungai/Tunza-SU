# Tunza SU

Tunza SU is a React Native application for reporting and managing faulty
infrastructure at Strathmore University. Students submit reports, maintenance
staff update assigned work, and administrators monitor activity.

## Current recovery baseline

- Expo SDK 58 and React Native 0.88
- Node.js 22 LTS
- Android 16 / API 36-compatible Expo toolchain
- Continuous Native Generation for Android and iOS
- Environment-based API and OAuth configuration
- Reproducible npm lockfiles for the client and server

## Prerequisites

- Node.js 22 (`nvm use` from the repository root)
- npm 11+
- MySQL 8+
- Android Studio for local Android builds
- Xcode 26 and CocoaPods 1.15.2+ for local iOS builds

## Configure the project

Create local environment files from the committed templates:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Set `EXPO_PUBLIC_API_URL` to a reachable backend URL. When testing on a
physical phone, `localhost` points to the phone, so use the development
computer's LAN address or an HTTPS development endpoint.

The database credentials that were previously committed must be rotated before
the old database is reused. Never restore those values to Git.

## Install and verify

```bash
cd server
npm ci
npm run check

cd ../client
npm ci
npm run doctor
npm run check
```

`npm run check` creates production-style Android, iOS, and web JavaScript
bundles. Expo Doctor validates package compatibility and current app-store
requirements.

## Run locally

Start the API:

```bash
cd server
npm run dev
```

Start the mobile app in another terminal:

```bash
cd client
npm start
```

For native development builds, use `npm run android` or `npm run ios`. Expo
generates the ignored `android/` and `ios/` directories from the dynamic
`app.config.js` configuration.

## EAS builds

The old EAS project identifier was removed because it may belong to a previous
account. Link the app to the intended Expo organization before building:

```bash
cd client
npx eas-cli@latest init
npx eas-cli@latest build --profile preview --platform android
```

Use the `production` profile only after the backend is deployed over HTTPS and
the release checklist has passed.

## Secure API setup

Phase 2 adds signed bearer sessions, server-verified Google ID tokens, role-based
authorization, validation, rate limits, security headers, upload restrictions,
database migrations, and integration tests.

After configuring `server/.env`, initialize or upgrade the database and create
the first administrator:

```bash
cd server
npm run migrate
npm run create-admin
npm test
```

Public registration always creates a student. Maintenance and additional admin
accounts must be provisioned by an administrator through the authenticated
`POST /users` API. The client stores native access tokens in Expo SecureStore
and validates a restored session against `GET /auth/me`.

Google login requires the mobile OAuth client identifiers in `client/.env` and
the corresponding comma-separated audiences in `server/.env` under
`GOOGLE_CLIENT_IDS`. Set `GOOGLE_HOSTED_DOMAIN` if only university-managed
Google accounts should be accepted.

The API must be deployed behind HTTPS. If it is behind a trusted reverse proxy,
set `TRUST_PROXY=true` so rate limiting receives the correct client address.

## Production services

Phase 3 moves report notifications to the API and supports private,
S3-compatible object storage. For local development, `STORAGE_DRIVER=local`
keeps report images under `server/uploads`. Production and multi-instance
deployments should use `STORAGE_DRIVER=s3`; when no public asset URL is set, the
API returns short-lived signed image URLs.

Configure SMTP in `server/.env` to notify administrators about new reports and
students when their report is resolved. Leaving `SMTP_HOST` blank disables
notifications without exposing email credentials to the mobile bundle.

The API includes a production container definition:

```bash
docker build -t tunza-su-api ./server
docker run --env-file server/.env -p 4000:4000 tunza-su-api
```

Run database migrations as a release step before starting the new API image.
The continuous-integration workflow validates migrations against MySQL 8,
executes API tests, audits high-severity dependencies, runs Expo Doctor, and
exports all mobile platforms on Node 22.

Phase 4 adds observability, environment-gated EAS profiles, guarded beta build
automation, release branding, support/privacy settings, and pilot operations.
Start with [the Phase 4 beta checklist](docs/phase-4-beta-checklist.md), then use
the [beta pilot](docs/beta-pilot-runbook.md) and
[operations](docs/operations-runbook.md) runbooks for recorded release proof.
The current verified results and external release gates are in
[the Phase 4 evidence record](docs/release-evidence.md).
