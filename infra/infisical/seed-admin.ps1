param(
    [string]$AdminEmail = "admin@example.com",
    [string]$AdminPassword = "Password123!",
    [string]$InfisicalUrl = "http://localhost:3000"
)

Write-Host "This is a placeholder script to show how to seed an Infisical admin/machine token for local dev."
Write-Host "It does NOT execute commands against your instance automatically. Replace the curl below with actual API/CLI calls from Infisical docs."

Write-Host "\nExample (manual) curl to create a machine token — replace with values from your instance:\n"
Write-Host "curl -X POST \"$InfisicalUrl/api/v1/machines\" `\"
Write-Host "  -H \"Content-Type: application/json\" `\"
Write-Host "  -d '{ \"name\": \"mailengine-local\", \"scopes\": [\"secrets:read\"] }' `\"
Write-Host "  -u \"$AdminEmail:$AdminPassword\""

Write-Host "\nWhen you have the token, set environment variables before running Aspire:\n"
Write-Host "$env:INFISICAL_URL = \"$InfisicalUrl\""
Write-Host "$env:INFISICAL_TOKEN = \"<machine-token>\""

Write-Host "\nDone (placeholder). Follow the Infisical docs for production-safe seeding steps."
