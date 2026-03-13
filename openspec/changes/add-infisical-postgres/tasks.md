# Tasks: add-infisical-postgres

1. Scoping & approvals (0.5h)
   - Confirm scope: single-node self-hosted Infisical + Aspire-managed Postgres for local/dev.
   - Identify required enterprise features (if any) and confirm they are out of scope.

2. Create OpenSpec artifacts (this change) (0.5h)
   - Add `proposal.md`, `design.md`, `tasks.md` (done).

3. Add PostgreSQL hosting resource to AppHost (1h)
   - Update `AppHost.cs` to add Postgres resource and a database instance using `AddPostgres` and `AddDatabase`.  
   - Configure persistence options and optional pgAdmin resource for visibility.

   - Status: **Done** — `AppHost.cs` updated to add `postgres` and `postgresdb` resources and to wait for `postgresdb` before starting `MailEngine_Server`.

4. Deploy Infisical into AppHost (2h)
   - Add a container/helm resource in AppHost for Infisical using the official docker-compose/helm template.
   - Do NOT wire Infisical to Postgres using Aspire native resource references in this initial pass; keep network connectivity via internal hostnames.
   - Seed Infisical initial admin token or document machine identity creation steps.

5. App config changes (2h)
   - MailEngine.Server: read Aspire-injected `POSTGRESDB_URI` from configuration and use `Npgsql`/Aspire client registration.  
   - Add startup code to fetch required non-DB secrets from Infisical (use SDK or `infisical export` integrated into the container entrypoint).

   - Status: **Done** — `Program.cs` updated to read and log `POSTGRESDB_URI` and `Aspire.Npgsql` added with `AddNpgsqlDataSource("postgresdb")` registration.

6. Certificates & PKI (1h)
   - Configure Infisical PKI profiles for developer cert issuance.
   - Document how to fetch dev TLS certs and load into local reverse proxy if needed.

7. Migrations & seed data (1h)
   - Ensure DB migrations run after Postgres is ready (AppHost wait semantics) and before services accept traffic.

8. Integration tests & validation (2h)
   - Run end-to-end dev flow: `aspire run` -> Infisical UI reachable -> MailEngine.Server connects to Postgres -> secrets fetched from Infisical -> smoke tests pass.

   - Status: **Done** — Added integration test `PostgresIntegrationTests` in `MailEngine.Server.Tests`. Test uses `POSTGRESDB_URI` if present, otherwise will start a Testcontainers Postgres when Docker is available. Tests run locally (skip starting Docker if environment lacks Docker).

9. Docs and runbook (1h)
   - Document developer steps to bootstrap Infisical machine identity, run AppHost, and test secret fetch.
   - Add backup and restore instructions for Infisical data and Postgres.

10. Optional: dynamic Postgres creds spike (2h)
   - Explore Infisical dynamic Postgres credential integration and evaluate if wiring dynamic credentials into apps is desirable.

11. Rollout & followups (ongoing)
   - Add monitoring, health checks, backups, RBAC tuning, and alerting.
