var builder = DistributedApplication.CreateBuilder(args);

// Add a PostgreSQL hosting resource and a database instance so Aspire
// can provision and inject connection properties into consuming projects.
var postgres = builder.AddPostgres("postgres");
var postgresdb = postgres.AddDatabase("postgresdb");

// Ensure server waits for Postgres to be ready and receives the injected
// configuration properties via Aspire's reference wiring.
var server = builder.AddProject<Projects.MailEngine_Server>("server")
    .WithHttpHealthCheck("/health")
    .WithExternalHttpEndpoints()
    .WaitFor(postgresdb)
    .WithReference(postgresdb);

var webfrontend = builder.AddViteApp("webfrontend", "../frontend")
    .WithReference(server)
    .WaitFor(server);

server.PublishWithContainerFiles(webfrontend, "wwwroot");

// NOTE: The following is a commented example showing how to add an Aspire-managed
// container resource for Infisical. It's intentionally commented out so it does
// not affect the current build/run behavior. When you're ready to enable
// Aspire-managed Infisical, uncomment and adapt the code below to your needs.
/*
var infisical = builder.AddContainer("infisical", image: "infisical/infisical:latest")
    // Ensure Infisical starts after Postgres so its migrations/connections work.
    .WaitFor(postgresdb)
    // Expose the UI port so developers can access the Infisical UI locally.
    .WithPublishedPort(3000)
    // Optionally set environment variables expected by Infisical (example):
    .WithEnvironment("DATABASE_URL", postgresdb.ConnectionString)
    .WithEnvironment("NODE_ENV", "development");

// If you want MailEngine.Server to wait for Infisical, add a WaitFor or WithReference:
// server.WaitFor(infisical);
*/

builder.Build().Run();
