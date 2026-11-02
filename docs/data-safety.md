# Tunza SU data-safety worksheet

This worksheet maps the current source code to store disclosure questions. The
deployer must reconcile it with the actual hosting, analytics, email, identity,
and crash-monitoring providers before submission.

| Data category | Collected | Optional | Purpose | Shared with service providers |
| --- | --- | --- | --- | --- |
| Name | Yes | No | Account and report workflow | Hosting/database; email when notifications are enabled |
| Email address | Yes | No | Account, authentication, notifications | Hosting/database; Google for Google sign-in; email provider |
| Admission/staff number | Yes | No | Institution account identity | Hosting/database |
| Phone number | Yes | Yes | Account contact field | Hosting/database |
| User ID / Google subject | Yes | Google subject only for Google login | Authentication and authorization | Hosting/database; Google for Google login |
| Report text and location | Yes | No for a submitted report | Facilities maintenance workflow | Hosting/database; email notifications may contain selected report details |
| Report photo | Yes | Yes | Explain a maintenance issue | Private object-storage provider |
| App interactions and diagnostics | Only when operational/crash monitoring is enabled | Deployment-dependent | Security, fault diagnosis, reliability | Hosting/logging and configured crash-monitoring provider |

## Current safeguards

- Passwords are stored as hashes, not plaintext.
- Native access tokens use the device's secure storage.
- The API applies role checks and validates restored sessions.
- Production images are designed for private S3-compatible storage with
  expiring signed links when no deliberate public asset URL is configured.
- Release builds require HTTPS API, privacy, and support URLs.
- Crash monitoring is optional and the app does not intentionally attach user
  names, emails, admission numbers, report text, or access tokens to events.

## Answers that require deployment evidence

Do not finalize the store form until the operator has documented encryption at
rest, provider subprocessors, regional transfers, retention and deletion
timelines, backup deletion, account-deletion handling, diagnostic-data
settings, and whether any provider uses data beyond delivering the service.
