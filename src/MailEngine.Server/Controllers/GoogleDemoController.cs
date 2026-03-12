using System.Threading.Tasks;
using MailEngine.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace MailEngine.Server.Controllers;

[ApiController]
[Route("api/google/demo")]
public class GoogleDemoController : ControllerBase
{
    private readonly IGoogleTokenStore _tokenStore;
    private readonly Microsoft.Extensions.Configuration.IConfiguration _config;

    public GoogleDemoController(IGoogleTokenStore tokenStore, Microsoft.Extensions.Configuration.IConfiguration config)
    {
        _tokenStore = tokenStore;
        _config = config;
    }

    [HttpGet("labels")]
    public async Task<IActionResult> GetLabels()
    {
        // Check session cookie for active account
        if (!Request.Cookies.TryGetValue("mailengine_session", out var googleUserId))
            return Unauthorized();

        var tokens = await _tokenStore.GetTokensAsync(googleUserId);
        if (tokens == null) return Unauthorized();

        var useMock = bool.TryParse(_config["Google:Mock"], out var m) && m;
        if (useMock)
        {
            var sample = new
            {
                labels = new[] {
                    new { id = "INBOX", name = "INBOX" },
                    new { id = "SENT", name = "SENT" },
                    new { id = "STARRED", name = "STARRED" }
                }
            };
            return Ok(sample);
        }

        // For demo, call Gmail labels API using access token (in real code, refresh if expired)
        using var http = new System.Net.Http.HttpClient();
        http.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", tokens.AccessToken);
        var res = await http.GetAsync("https://gmail.googleapis.com/gmail/v1/users/me/labels");
        if (!res.IsSuccessStatusCode) return StatusCode((int)res.StatusCode);
        var content = await res.Content.ReadAsStringAsync();
        return Content(content, "application/json");
    }
}
