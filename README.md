# Tunza SU

Tunza SU is a React Native application for reporting and managing faulty
infrastructure at Strathmore University. Students submit reports, maintenance
staff update assigned work, and administrators monitor activity.

## Current recovery baseline

- Expo SDK 57 and React Native 0.86
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

`npm run check` creates a production-style Android JavaScript bundle. Expo
Doctor validates package compatibility and current app-store requirements.

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
generates the ignored `android/` and `ios/` directories from `app.json`.

## EAS builds

The old EAS project identifier was removed because it may belong to a previous
account. Link the app to the intended Expo organization before building:

```bash
cd client
npx eas-cli@latest init
npx eas-cli@latest build --profile preview --platform android
```

Use the `production` profile only after the backend is deployed over HTTPS and
the authentication/authorization work in Phase 2 is complete.

## Known Phase 2 work

The current API is retained for recovery purposes. It still needs authenticated
sessions, role-based authorization, verified Google identity tokens, database
migrations, upload restrictions, rate limiting, and integration tests before it
can be exposed to the public internet.
