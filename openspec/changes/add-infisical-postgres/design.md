# Design: Infisical + PostgreSQL for MailEngine AppHost

## Overview
This design describes how Aspire will host PostgreSQL while Infisical runs as a self-hosted secrets and PKI service inside the same AppHost. The apps will consume a mix of Aspire-injected Postgres properties and Infisical-provided secrets at startup.

ASCII architecture sketch:

┌──────────────────────────────┐        ┌──────────────┐
│ Aspire AppHost               │        │ Developer PC │
│  ┌──────────────┐            │        │              │
│  │ Postgres     │◀───────────┤────────│ CLI / Browser │
│  │ (hosting)    │            │        │              │
│  └──────────────┘            │        └──────────────┘
│  ┌──────────────┐            │
│  │ Infisical    │◀───────────┤─▶ MailEngine.Server (reads Infisical & Aspire envs)
│  │ (docker/helm)│            │
│  └──────────────┘            │
│  ┌──────────────┐            │
│  │ MailEngine   │◀───────────┤─▶ Frontend / API
│  │ services     │            │
│  └──────────────┘            │
└──────────────────────────────┘

## Integration Patterns

1) Aspire-managed Postgres + Infisical-managed secrets (recommended initial):
- Aspire provisions Postgres and injects env vars into consuming projects: `POSTGRESDB_URI`, `POSTGRESDB_HOST`, `POSTGRESDB_PORT`, `POSTGRESDB_DATABASE`.
- Infisical stores non-DB secrets (SMTP, OAuth client secrets, TLS private keys) and provides SDK/agent/CLI for apps to retrieve them at startup.
- Apps connect to Postgres using the Aspire-injected connection and use Infisical for rotated credentials or other secrets.

2) Infisical dynamic Postgres credentials (optional):
- Infisical can generate dynamic DB credentials and rotate them. If chosen, evaluate options:
  - Let Infisical manage DB user lifecycle while Aspire still manages the server's lifecycle.
  - Or wire Infisical to a separate Postgres instance it manages.
- NOTE: For initial rollout avoid wiring Infisical to Postgres using Aspire native `WithReference` wiring. Keep responsibilities separate to reduce bootstrapping complexity.

## Boot Order & Health
- AppHost should ensure Postgres is ready before running DB migrations.
- Infisical must be bootstrapped with an admin user or machine identity; provide a seeded `.env` for local dev or use AppHost secrets to pass initial admin token.
- MailEngine services must wait for both Postgres connectivity and Infisical reachability; implement retry/backoff and clear startup logs.

## Deployment Options
- Developer / local: Use Infisical `docker-compose.prod.yml` or `docker-compose.dev.yml` included in Infisical repo. Run via AppHost resource or run as container resource that AppHost starts.
- Kubernetes / production: Use Infisical Helm chart and run behind internal network, register machine identities for app services.

## Security & Access
- Use Infisical machine identities for service-to-service authentication in production and local dev where possible.
- Limit Infisical admin UI access to developer hosts via network rules.
- Ensure backups for Infisical (secrets + DB) and Postgres are scheduled; store backups outside Infisical DB to avoid single point of failure.

## Example snippets (proposal-level)
- AppHost (C#) to add Postgres resource (reference):

```csharp
var builder = DistributedApplication.CreateBuilder(args);
var postgres = builder.AddPostgres("postgres");
var postgresdb = postgres.AddDatabase("postgresdb");
var exampleProject = builder.AddProject<Projects.MailEngineServer>("mailengine")
    .WaitFor(postgresdb)
    .WithReference(postgresdb);
```

- Client project: use `builder.AddNpgsqlDataSource("postgresdb")` to obtain `NpgsqlDataSource` from DI. Aspire injects `POSTGRESDB_URI` etc into configuration.

## Developer flow
1. `aspire run` to start AppHost (Postgres + Infisical + app services started by AppHost).
2. Create Infisical machine identity for local dev (or use seeded `.env` on first run).
3. MailEngine services read Aspire-injected Postgres connection and fetch additional secrets from Infisical using SDK or `infisical export` in entrypoint.
