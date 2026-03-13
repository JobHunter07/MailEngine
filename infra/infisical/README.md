Infisical Local Runbook
======================

Purpose
-------
Provide developer-first instructions to run a self-hosted Infisical instance locally for use with this MailEngine workspace. This runbook uses the official Infisical docker-compose/helm artifacts and documents how to seed an admin/machine identity for local development.

Notes
-----
- This runbook does not attempt to modify `AppHost.cs` directly. For initial iterations we run Infisical alongside Aspire via Docker Compose to keep the dev flow simple and reproducible.
- When ready, we can add an Aspire container/helm resource into `AppHost.cs` that references these same images.

Quick start (recommended)
-------------------------
1. Clone or download the official Infisical docker-compose deployment (see upstream docs):

   git clone https://github.com/Infisical/infisical.git

2. Review and copy the example `.env` provided by the Infisical repo. Update any ports if they conflict with your machine.

3. Start Infisical services:

   docker compose up -d

4. Open the Infisical UI (default): http://localhost:3000 (confirm with the upstream compose file)

Seeding an admin / creating a machine token
------------------------------------------
Infisical supports creating an admin user via the UI or via the CLI/API. For local development you can either:

- Use the web UI to sign up and mark the account as an admin; or
- Use the Infisical CLI to create a machine token and export it as `INFISICAL_TOKEN` for apps to consume.

Example (placeholder) curl to create a machine token — replace values from your instance and admin credentials:

  curl -X POST "http://localhost:3000/api/v1/machines" \
    -H "Content-Type: application/json" \
    -d '{ "name": "mailengine-local", "scopes": ["secrets:read"] }' \
    -u "admin@example.com:ADMIN_PASSWORD"

Save the returned token and set it in your environment when running Aspire or your services:

  $env:INFISICAL_URL = "http://localhost:3000"
  $env:INFISICAL_TOKEN = "<machine-token>"

Running with Aspire
-------------------
Start Asp ire AppHost as you normally would (from the repo root):

  aspire run

Ensure the environment variables above are set in the shell that launches `aspire run`, or configure the `AppHost` to inject them into consuming projects once you add an Asp ire container resource.

Security & cleanup
------------------
- This setup is for local development only. Do not reuse these credentials in production.
- To stop and remove containers:

  docker compose down -v

Next steps
----------
- Option A: Add an Aspire container resource in `AppHost.cs` referencing the same Infisical compose images so Infisical is started and managed by Aspire.
- Option B: Provide a Helm chart variant for Kubernetes-based local dev (kind/minikube).
