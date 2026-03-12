using System.Threading.Tasks;

namespace MailEngine.Server.Services;

public interface IGoogleTokenStore
{
    Task StoreTokensAsync(string googleUserId, GoogleTokenResponse tokens);
    Task<GoogleTokenResponse?> GetTokensAsync(string googleUserId);
    Task DeleteTokensAsync(string googleUserId);
}
