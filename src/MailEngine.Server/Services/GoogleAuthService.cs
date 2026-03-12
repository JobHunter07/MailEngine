using System;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace MailEngine.Server.Services;

public class GoogleAuthService : IGoogleAuthService
{
    private readonly IConfiguration _config;
    private readonly IHttpClientFactory _httpClientFactory;

    public GoogleAuthService(IConfiguration config, IHttpClientFactory httpClientFactory)
    {
        _config = config;
        _httpClientFactory = httpClientFactory;
    }

    public (string CodeVerifier, string CodeChallenge, string State, string RedirectUrl) CreateAuthRequest(string returnUrl = null)
    {
        var codeVerifier = GenerateCodeVerifier();
        var codeChallenge = CreateCodeChallenge(codeVerifier);
        var state = Convert.ToHexString(RandomNumberGenerator.GetBytes(16));

        var clientId = _config["Google:ClientId"] ?? string.Empty;
        var redirectUri = _config["Google:RedirectUri"] ?? string.Empty;

        var scope = Uri.EscapeDataString("openid email profile https://www.googleapis.com/auth/gmail.readonly");

        var url = $"https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id={Uri.EscapeDataString(clientId)}&redirect_uri={Uri.EscapeDataString(redirectUri)}&scope={scope}&state={state}&code_challenge={codeChallenge}&code_challenge_method=S256&access_type=offline&prompt=consent";

        return (codeVerifier, codeChallenge, state, url);
    }

    public async Task<GoogleTokenResponse?> ExchangeCodeAsync(string code, string codeVerifier, string redirectUri)
    {
        // If mocking is enabled in configuration, return fake tokens for local development/testing
        var useMock = bool.TryParse(_config["Google:Mock"], out var m) && m;
        if (useMock)
        {
            return await Task.FromResult(new GoogleTokenResponse(
                AccessToken: "mock_access_token",
                RefreshToken: "mock_refresh_token",
                ExpiresInSeconds: 3600,
                IdToken: "mock_id_token"
            ));
        }

        var clientId = _config["Google:ClientId"] ?? string.Empty;
        var clientSecret = _config["Google:ClientSecret"] ?? string.Empty;

        var http = _httpClientFactory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, "https://oauth2.googleapis.com/token")
        {
            Content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string,string>("code", code),
                new KeyValuePair<string,string>("client_id", clientId),
                new KeyValuePair<string,string>("client_secret", clientSecret),
                new KeyValuePair<string,string>("redirect_uri", redirectUri),
                new KeyValuePair<string,string>("grant_type", "authorization_code"),
                new KeyValuePair<string,string>("code_verifier", codeVerifier)
            })
        };

        var res = await http.SendAsync(req);
        if (!res.IsSuccessStatusCode) return null;

        using var s = await res.Content.ReadAsStreamAsync();
        using var doc = await JsonDocument.ParseAsync(s);

        var root = doc.RootElement;
        var accessToken = root.GetProperty("access_token").GetString() ?? string.Empty;
        var refreshToken = root.TryGetProperty("refresh_token", out var r) ? r.GetString() ?? string.Empty : string.Empty;
        var expiresIn = root.TryGetProperty("expires_in", out var e) ? e.GetInt32() : 0;
        var idToken = root.TryGetProperty("id_token", out var i) ? i.GetString() ?? string.Empty : string.Empty;

        return new GoogleTokenResponse(accessToken, refreshToken, expiresIn, idToken);
    }

    private static string GenerateCodeVerifier()
    {
        var bytes = RandomNumberGenerator.GetBytes(64);
        return Base64UrlEncode(bytes);
    }

    private static string CreateCodeChallenge(string codeVerifier)
    {
        using var sha256 = SHA256.Create();
        var challengeBytes = sha256.ComputeHash(Encoding.ASCII.GetBytes(codeVerifier));
        return Base64UrlEncode(challengeBytes);
    }

    private static string Base64UrlEncode(byte[] input)
    {
        return Convert.ToBase64String(input)
            .TrimEnd('=')
            .Replace('+', '-')
            .Replace('/', '_');
    }
}
