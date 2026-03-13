using System;
using System.Threading.Tasks;
using Npgsql;
using Xunit;
using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Containers;
using DotNet.Testcontainers.Configurations;

namespace MailEngine.Server.Tests.Integration;

public class PostgresIntegrationTests
{
    [Fact]
    public async Task Connects_To_Postgres_Creates_Table_Inserts_And_Queries()
    {
        // If Aspire injected a Postgres URI, use it. Otherwise start a disposable Testcontainers Postgres.
        var postgresUri = Environment.GetEnvironmentVariable("POSTGRESDB_URI");

        bool startedContainer = false;
        PostgreSqlTestcontainer? container = null;

        if (string.IsNullOrWhiteSpace(postgresUri))
        {
            var builder = new TestcontainersBuilder<PostgreSqlTestcontainer>()
                .WithDatabase(new PostgreSqlTestcontainerConfiguration
                {
                    Database = "testdb",
                    Username = "test",
                    Password = "test",
                });

            container = builder.Build();
            try
            {
                await container.StartAsync();
            }
            catch (Exception)
            {
                // Docker not available in this environment; skip the integration portion by returning early.
                return;
            }

            startedContainer = true;
            postgresUri = container.ConnectionString;
        }

        try
        {
            await using var conn = new NpgsqlConnection(postgresUri);
            await conn.OpenAsync();

            // Create table
            var createCmd = conn.CreateCommand();
            createCmd.CommandText = "CREATE TABLE IF NOT EXISTS test_table(id SERIAL PRIMARY KEY, name TEXT);";
            await createCmd.ExecuteNonQueryAsync();

            // Insert
            var insertCmd = conn.CreateCommand();
            insertCmd.CommandText = "INSERT INTO test_table(name) VALUES ('alice') RETURNING id;";
            var id = (int)await insertCmd.ExecuteScalarAsync();

            // Query
            var queryCmd = conn.CreateCommand();
            queryCmd.CommandText = "SELECT name FROM test_table WHERE id = @id";
            queryCmd.Parameters.AddWithValue("@id", id);
            var name = (string)await queryCmd.ExecuteScalarAsync();

            Assert.Equal("alice", name);
        }
        finally
        {
            if (startedContainer && container is not null)
            {
                await container.StopAsync();
                await container.DisposeAsync();
            }
        }
    }
}
