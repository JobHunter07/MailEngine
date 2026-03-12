using System.Threading.Tasks;

namespace MailEngine.Server.Services;

public interface IGoogleAuthService
{
    (string CodeVerifier, string CodeChallenge, string State, string RedirectUrl) CreateAuthRequest(string returnUrl = null);

    Task<GoogleTokenResponse?> ExchangeCodeAsync(string code, string codeVerifier, string redirectUri);
}

public record GoogleTokenResponse(string AccessToken, string RefreshToken, int ExpiresInSeconds, string IdToken);
