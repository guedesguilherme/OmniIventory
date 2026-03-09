using OmniInventory.Application.Interfaces;

namespace OmniInventory.Api.Services
{
    // This class signs the contract saying "I will act as the ICurrentUserService"
    public class DummyCurrentUserService : ICurrentUserService
    {
        // For now, we hardcode your identity. ZERO HEADACHE.
        // When Infra gives us Azure AD, we simply create an "AzureCurrentUserService" 
        // that reads the real Microsoft token, and we delete this file!
        public string UserId => "00000000-0000-0000-0000-000000000001";
        public string UserName => "Guilherme (Mock Admin)";
    }
}