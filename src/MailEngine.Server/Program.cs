var builder = WebApplication.CreateBuilder(args);

// Add service defaults & Aspire client integrations.
builder.AddServiceDefaults();

// Allow CORS in development so frontend can call backend during local dev
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
    {
        // In development accept any origin and allow credentials for ease of testing
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Add services to the container.
builder.Services.AddProblemDetails();
builder.Services.AddMemoryCache();
builder.Services.AddHttpClient();
builder.Services.AddControllers();

// Google services were removed; Keycloak will be used for authentication/federation.

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Read Aspire-injected Postgres connection info (if available) and log for developer visibility.
// Aspire injects resource properties as env vars named after the resource, e.g. POSTGRESDB_URI.
var postgresUri = builder.Configuration["POSTGRESDB_URI"] ?? Environment.GetEnvironmentVariable("POSTGRESDB_URI");
if (!string.IsNullOrEmpty(postgresUri))
{
    Console.WriteLine($"[Startup] Detected Aspire Postgres URI: {postgresUri}");
    // Register Aspire Npgsql data source so the app can obtain an NpgsqlDataSource via DI.
    try
    {
        builder.AddNpgsqlDataSource("postgresdb");
        Console.WriteLine("[Startup] Registered Aspire Npgsql data source 'postgresdb'.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[Startup] Could not register Npgsql data source: {ex.Message}");
    }
}

// If Infisical is configured for local dev, fetch secrets and inject them into environment variables.
var infisicalUrl = builder.Configuration["INFISICAL_URL"] ?? Environment.GetEnvironmentVariable("INFISICAL_URL");
var infisicalToken = builder.Configuration["INFISICAL_TOKEN"] ?? Environment.GetEnvironmentVariable("INFISICAL_TOKEN");
if (!string.IsNullOrEmpty(infisicalUrl) && !string.IsNullOrEmpty(infisicalToken))
{
    Console.WriteLine("[Startup] Infisical config detected — attempting to fetch secrets.");
    try
    {
        System.Threading.Tasks.Task.Run(async () =>
        {
            using var http = new System.Net.Http.HttpClient();
            http.BaseAddress = new Uri(infisicalUrl);
            http.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", infisicalToken);

            // Try a few common endpoints; developers can adjust as their Infisical deployment expects.
            var endpoints = new[] { "/api/v1/secrets", "/api/v1/secrets/all", "/api/v1/secret" };
            foreach (var ep in endpoints)
            {
                try
                {
                    var res = await http.GetAsync(ep);
                    if (!res.IsSuccessStatusCode) continue;

                    var json = await res.Content.ReadAsStringAsync();
                    using var doc = System.Text.Json.JsonDocument.Parse(json);
                    var root = doc.RootElement;

                    if (root.ValueKind == System.Text.Json.JsonValueKind.Object)
                    {
                        foreach (var prop in root.EnumerateObject())
                        {
                            var name = prop.Name;
                            var value = prop.Value.ValueKind == System.Text.Json.JsonValueKind.String
                                ? prop.Value.GetString()
                                : prop.Value.ToString();
                            if (value is not null)
                            {
                                Environment.SetEnvironmentVariable(name, value);
                                Console.WriteLine($"[Startup] Imported secret: {name}");
                            }
                        }
                    }
                    else if (root.ValueKind == System.Text.Json.JsonValueKind.Array)
                    {
                        foreach (var item in root.EnumerateArray())
                        {
                            if (item.ValueKind != System.Text.Json.JsonValueKind.Object) continue;
                            string? name = null;
                            string? value = null;
                            if (item.TryGetProperty("key", out var k)) name = k.GetString();
                            if (item.TryGetProperty("name", out var n) && string.IsNullOrEmpty(name)) name = n.GetString();
                            if (item.TryGetProperty("value", out var v)) value = v.GetString();
                            if (item.TryGetProperty("secret", out var s) && string.IsNullOrEmpty(value)) value = s.GetString();
                            if (!string.IsNullOrEmpty(name) && value is not null)
                            {
                                Environment.SetEnvironmentVariable(name, value);
                                Console.WriteLine($"[Startup] Imported secret: {name}");
                            }
                        }
                    }

                    // Stop after the first successful endpoint
                    break;
                }
                catch (System.Exception ex)
                {
                    Console.WriteLine($"[Startup] Infisical endpoint {ep} fetch failed: {ex.Message}");
                }
            }
        }).GetAwaiter().GetResult();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[Startup] Failed to import secrets from Infisical: {ex.Message}");
    }
}

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Use CORS before mapping controllers so requests from the frontend are accepted
app.UseCors("DevCors");

app.MapControllers();


string[] summaries = ["Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"];

var api = app.MapGroup("/api");
api.MapGet("weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.MapDefaultEndpoints();

app.UseFileServer();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
