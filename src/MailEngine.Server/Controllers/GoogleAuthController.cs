using System;
using System.Threading.Tasks;
using MailEngine.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;

namespace MailEngine.Server.Controllers;

[ApiController]
[Route("auth/google")]
public class GoogleAuthController : ControllerBase
{
    private readonly IGoogleAuthService _authService;
    private readonly IGoogleTokenStore _tokenStore;
    private readonly IGoogleProviderAccountService _providerService;
    private readonly IMemoryCache _cache;
    private readonly IConfiguration _config;

    public GoogleAuthController(
        IGoogleAuthService authService,
        IGoogleTokenStore tokenStore,
        IGoogleProviderAccountService providerService,
        IMemoryCache cache,
        IConfiguration config)
    {
        _authService = authService;
        _tokenStore = tokenStore;
        _providerService = providerService;
        _cache = cache;
        _config = config;
    }

    [HttpGet("start")]
    public IActionResult Start([FromQuery] string? returnUrl)
    {
        var (verifier, challenge, state, url) = _authService.CreateAuthRequest(returnUrl);
        // Store verifier in memory keyed by state for a short time
        _cache.Set($"pkce:{state}", verifier, TimeSpan.FromMinutes(10));
        return Ok(new { redirect = url, state });
    }

    [HttpGet("callback")]
    public async Task<IActionResult> Callback([FromQuery] string code, [FromQuery] string state)
    {
        if (string.IsNullOrEmpty(code) || string.IsNullOrEmpty(state)) return BadRequest();

        if (!_cache.TryGetValue($"pkce:{state}", out string? verifier))
            return BadRequest("Invalid or expired state");

        var redirectUri = _config["Google:RedirectUri"] ?? string.Empty;

        var tokens = await _authService.ExchangeCodeAsync(code, verifier, redirectUri);
        if (tokens == null) return StatusCode(502, "Token exchange failed");

        // TODO: parse id_token to get google user id. For now, store under a placeholder id.
        var googleUserId = Guid.NewGuid().ToString();

        await _providerService.EnsureProviderRootAsync(googleUserId);
        await _tokenStore.StoreTokensAsync(googleUserId, tokens);

        // Set a simple session cookie (placeholder). Real implementation should set secure, httpOnly cookie.
        Response.Cookies.Append("mailengine_session", googleUserId, new Microsoft.AspNetCore.Http.CookieOptions { HttpOnly = true, SameSite = Microsoft.AspNetCore.Http.SameSiteMode.Strict });

        // Redirect to frontend app inbox route to avoid server root 404 in dev
        var frontendUrl = _config["Frontend:Url"] ?? string.Empty;
        frontendUrl = frontendUrl?.TrimEnd('/') ?? string.Empty;
        var redirectTo = string.IsNullOrEmpty(frontendUrl) ? "/inbox" : $"{frontendUrl}/inbox";
        return Redirect(redirectTo);
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("mailengine_session");
        return NoContent();
    }

    [HttpDelete("disconnect")]
    public async Task<IActionResult> Disconnect([FromQuery] string googleUserId)
    {
        if (string.IsNullOrEmpty(googleUserId)) return BadRequest();
        // Revoke tokens if needed (TODO)
        await _tokenStore.DeleteTokensAsync(googleUserId);
        await _providerService.DeleteProviderRootAsync(googleUserId);
        return NoContent();
    }
}
