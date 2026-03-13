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
