using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;

namespace MailEngine.Server.Services;

public class GoogleProviderAccountService : IGoogleProviderAccountService
{
    private readonly string _accountsRoot;

    public GoogleProviderAccountService(IHostEnvironment env)
    {
        _accountsRoot = Path.Combine(env.ContentRootPath, "data", "accounts", "gmail");
        Directory.CreateDirectory(_accountsRoot);
    }

    public Task EnsureProviderRootAsync(string googleUserId)
    {
        var dir = Path.Combine(_accountsRoot, googleUserId);
        Directory.CreateDirectory(dir);
        return Task.CompletedTask;
    }

    public Task DeleteProviderRootAsync(string googleUserId)
    {
        var dir = Path.Combine(_accountsRoot, googleUserId);
        if (Directory.Exists(dir)) Directory.Delete(dir, true);
        return Task.CompletedTask;
    }
}
