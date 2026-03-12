using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Xunit;
using MailEngine.Server.Services;

namespace MailEngine.Server.Tests;

public class GoogleAuthServiceTests
{
    private IGoogleAuthService CreateService(IConfiguration config)
    {
        var services = new ServiceCollection();
        services.AddHttpClient();
        services.AddSingleton<IConfiguration>(config);
        var sp = services.BuildServiceProvider();
        var factory = sp.GetRequiredService<System.Net.Http.IHttpClientFactory>();
        return new GoogleAuthService(config, factory);
    }

    [Fact]
    public void CreateAuthRequest_Generates_CodeChallenge_And_State()
    {
        var config = new ConfigurationBuilder().AddInMemoryCollection().Build();
        var svc = CreateService(config);
        var (verifier, challenge, state, url) = svc.CreateAuthRequest();
        Assert.False(string.IsNullOrEmpty(verifier));
        Assert.False(string.IsNullOrEmpty(challenge));
        Assert.False(string.IsNullOrEmpty(state));
        Assert.Contains("accounts.google.com", url);
    }

    [Fact]
    public async Task ExchangeCodeAsync_Returns_Mock_When_Configured()
    {
        var config = new ConfigurationBuilder().AddInMemoryCollection(new[] { new KeyValuePair<string,string>("Google:Mock","true") }).Build();
        var svc = CreateService(config);
        var tokens = await svc.ExchangeCodeAsync("any","verifier","http://localhost/callback");
        Assert.NotNull(tokens);
        Assert.Equal("mock_access_token", tokens.AccessToken);
        Assert.Equal("mock_refresh_token", tokens.RefreshToken);
    }
}
