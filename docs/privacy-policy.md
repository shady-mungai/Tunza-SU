# Tunza SU privacy notice

**Release-candidate version:** 1 November 2026

> Publication gate: the organization operating the deployed Tunza SU service
> must add its legal name, jurisdiction, contact details, retention periods, and
> any institution-specific procedures before using this notice in a store
> submission. This repository does not establish who the data controller is.

Tunza SU helps a university community report faulty infrastructure and lets
authorized maintenance staff and administrators manage those reports. This
notice describes the data handled by the current application and API.

## Data the service handles

- Account data: name, email address, admission or staff number, role, optional
  phone number, password hash, and account timestamps.
- Google sign-in data: the verified Google account identifier, email, name, and
  hosted-domain claim needed to authenticate the account. The service does not
  receive the user's Google password.
- Maintenance reports: title, description, location, category, priority,
  status, optional image, reporter, assigned staff member, and timestamps.
- Operational data: request identifier, route, response status, duration,
  environment, and release version. If crash monitoring is enabled, the
  monitoring provider may receive technical error and performance information.
  The configured application code does not intentionally attach names, email
  addresses, admission numbers, report descriptions, or access tokens to crash
  events.

## Why the data is used

The operator uses this data to authenticate users, submit and manage
maintenance reports, assign work, notify relevant people, protect the service,
investigate faults, and improve reliability. The operator must document the
lawful basis that applies in its jurisdiction before launch.

## Who can see the data

Students can access their own reports. Maintenance staff can access reports
assigned to them. Administrators can manage reports and user accounts as
required to operate the service. The operator may use service providers for
hosting, databases, private object storage, email delivery, Google
authentication, and optional crash monitoring. The operator must name the
providers used in the deployed environment and complete appropriate agreements
before launch.

The application is not designed to sell personal data or use report data for
advertising. The operator must update this notice before introducing either
practice.

## Storage, security, and retention

The API supports encrypted HTTPS transport, hashed passwords, signed sessions,
role-based access controls, private object storage, expiring image links, and
security logging. No system is completely secure.

The source code does not define production retention periods. Before launch,
the operator must publish how long accounts, reports, images, logs, backups,
and support requests are kept and how deletion propagates through backups.

## User choices and requests

Users may contact the published support channel to request access, correction,
or deletion, or to raise a privacy concern. Some report records may need to be
retained for legitimate operational, safety, audit, or legal reasons. The
operator must verify the requester's identity, explain any limitation, and
provide the rights required by applicable law.

Users can choose not to attach an image or phone number. If Google sign-in is
offered, users may instead use the supported email or admission-number login
flow when an account password is available.

## Children and sensitive information

The release is intended for the operator's authorized university community. It
is not designed for children or for emergency reporting. Users should not put
medical, financial, government-identity, security credential, or other
unnecessary sensitive data in a maintenance report.

## Changes and contact

The operator will publish material changes with a revised effective date. The
production privacy URL and support channel are release-required settings and
are shown in the app's Help & Support screen.
