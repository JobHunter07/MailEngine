# Proposal: Add Infisical (self-hosted) + PostgreSQL to AppHost

## Change Name
add-infisical-postgres

## Summary
Add a self-hosted secrets & certificate management service (Infisical) and a PostgreSQL hosting resource to the Aspire AppHost so the MailEngine solution can run 100% locally with secure secrets, certificate lifecycle, and database services. Aspire will host PostgreSQL via the native integration and inject connection properties into consuming projects; Infisical will run as a co-located, self-hosted service (docker-compose or helm) and supply runtime secrets and certs to apps.

## Goals
- Provide a reproducible, local-first configuration for developers to run MailEngine with a Postgres database and a secrets/cert management control plane.
- Use Aspire PostgreSQL integration to create and manage Postgres resources and have Aspire inject connection properties into client projects.
- Run Infisical self-hosted inside the AppHost so teams can manage secrets, dynamic credentials, PKI/certificates, and rotation without external SaaS.
- Allow consuming apps to read Aspire-injected env vars (Postgres connection info) and pull additional secrets from Infisical at startup.

## Non-goals
- Replacing Aspire's Postgres hosting integration with a custom Postgres operator. Aspire will remain the Postgres host owner initially.
- Implementing full production-grade HA for Infisical in this change — initial scope focuses on single-node, self-hosted, developer + small-team readiness.

## Why
- Open-source and MIT-licensed core (Infisical) reduces vendor cost and allows inspection and contribution.
- Infisical provides secrets, dynamic secrets (Postgres rotation), certificate management (private CA, profiles), audit logs, SDKs (including .NET), CLI/agent — matching MailEngine requirements for secrets and certs.
- Aspire's Postgres integration simplifies local DB provisioning and injects connection metadata into the apps (e.g., `POSTGRESDB_URI`), reducing manual config friction.

## Acceptance Criteria
- Aspire AppHost includes a PostgreSQL server & database resource and injector properties are available to consuming projects (e.g., `POSTGRESDB_URI`, `POSTGRESDB_HOST`).
- Infisical is deployed in the AppHost (docker-compose or helm) and reachable by local services.
- MailEngine server starts and uses the Aspire-injected Postgres connection to connect to the DB.
- MailEngine services fetch non-DB secrets (API keys, SMTP creds, TLS private keys for dev certs) from Infisical at startup using a machine identity or CLI/agent.
- Documented developer workflow: start AppHost, create Infisical machine identity for local dev, and run the app.

## Risks
- Operational overhead: running a secrets platform requires backups, monitoring, and secure access controls.
- Bootstrapping: ensure Infisical has initial admin credentials and Postgres migrations applied before apps start; ordering must be handled by AppHost resource wait semantics.
- Security: the Infisical open-source core is MIT but enterprise features live in `ee/`; evaluate feature gaps required for your team.

## Next steps
- See design.md for architecture options and preferred patterns.
- Execute tasks in tasks.md to add resources, configuration, and docs.
