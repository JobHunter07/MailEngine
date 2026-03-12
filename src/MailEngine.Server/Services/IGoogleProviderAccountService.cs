using System.Threading.Tasks;

namespace MailEngine.Server.Services;

public interface IGoogleProviderAccountService
{
    Task EnsureProviderRootAsync(string googleUserId);
    Task DeleteProviderRootAsync(string googleUserId);
}
