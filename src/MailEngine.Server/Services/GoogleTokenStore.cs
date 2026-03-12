using System;
using System.IO;
using System.Security.Cryptography;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;

namespace MailEngine.Server.Services;

public class GoogleTokenStore : IGoogleTokenStore
{
    private readonly string _accountsRoot;

    public GoogleTokenStore(IHostEnvironment env)
    {
        _accountsRoot = Path.Combine(env.ContentRootPath, "data", "accounts", "gmail");
        Directory.CreateDirectory(_accountsRoot);
    }

    public Task StoreTokensAsync(string googleUserId, GoogleTokenResponse tokens)
    {
        var dir = Path.Combine(_accountsRoot, googleUserId);
        Directory.CreateDirectory(dir);
        var file = Path.Combine(dir, "tokens.json.enc");

        var plain = JsonSerializer.Serialize(tokens);
        var plainBytes = System.Text.Encoding.UTF8.GetBytes(plain);
        var protectedBytes = ProtectedData.Protect(plainBytes, null, DataProtectionScope.CurrentUser);
        File.WriteAllBytes(file, protectedBytes);
        return Task.CompletedTask;
    }

    public Task<GoogleTokenResponse?> GetTokensAsync(string googleUserId)
    {
        var file = Path.Combine(_accountsRoot, googleUserId, "tokens.json.enc");
        if (!File.Exists(file)) return Task.FromResult<GoogleTokenResponse?>(null);

        var protectedBytes = File.ReadAllBytes(file);
        var plainBytes = ProtectedData.Unprotect(protectedBytes, null, DataProtectionScope.CurrentUser);
        var json = System.Text.Encoding.UTF8.GetString(plainBytes);
        var tokens = JsonSerializer.Deserialize<GoogleTokenResponse>(json);
        return Task.FromResult(tokens);
    }

    public Task DeleteTokensAsync(string googleUserId)
    {
        var dir = Path.Combine(_accountsRoot, googleUserId);
        if (Directory.Exists(dir)) Directory.Delete(dir, true);
        return Task.CompletedTask;
    }
}
