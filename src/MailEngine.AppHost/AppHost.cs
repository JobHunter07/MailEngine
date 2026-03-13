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

builder.Build().Run();
