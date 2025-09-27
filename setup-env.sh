#!/bin/bash

# Azure B2C Environment Setup Script
echo "Setting up Azure B2C environment variables..."

# Create .env.local file
cat > .env.local << 'EOF'
# Azure B2C Authentication Configuration
# Replace the placeholder values with your actual Azure B2C configuration

# Client ID from your Azure B2C app registration
NEXT_PUBLIC_AD_PUBLIC_CLIENT_ID=""

# Authority URL for Vipps SSO user flow
NEXT_PUBLIC_AD_PUBLIC_AUTHORITY=""

# Authority URL for OTP (One-Time Password) user flow  
NEXT_PUBLIC_AD_PUBLIC_AUTHORITY_PHONE=""

# Redirect URL after successful authentication
NEXT_PUBLIC_AD_PUBLIC_REDIRECT_URL=""

# Redirect URL after logout
NEXT_PUBLIC_AD_PUBLIC_POST_LOGOUT_REDIRECT_URL=""

# Known authority for token validation
NEXT_PUBLIC_AD_PUBLIC_KNOWN_AUTHORITY=""
EOF

echo "✅ Created .env.local file"
echo ""
echo "📝 Please edit .env.local and add your Azure B2C configuration values:"
echo ""
echo "1. NEXT_PUBLIC_AD_PUBLIC_CLIENT_ID - Your Azure B2C app client ID"
echo "2. NEXT_PUBLIC_AD_PUBLIC_AUTHORITY - Vipps SSO user flow authority URL"
echo "3. NEXT_PUBLIC_AD_PUBLIC_AUTHORITY_PHONE - OTP user flow authority URL"
echo "4. NEXT_PUBLIC_AD_PUBLIC_REDIRECT_URL - Redirect URL after login (e.g., http://localhost:3000/auth)"
echo "5. NEXT_PUBLIC_AD_PUBLIC_POST_LOGOUT_REDIRECT_URL - Redirect URL after logout"
echo "6. NEXT_PUBLIC_AD_PUBLIC_KNOWN_AUTHORITY - Your Azure B2C tenant authority"
echo ""
echo "🔗 Example values:"
echo "NEXT_PUBLIC_AD_PUBLIC_CLIENT_ID=\"12345678-1234-1234-1234-123456789012\""
echo "NEXT_PUBLIC_AD_PUBLIC_AUTHORITY=\"https://yourtenant.b2clogin.com/yourtenant.onmicrosoft.com/B2C_1_signup_signin_vipps\""
echo "NEXT_PUBLIC_AD_PUBLIC_AUTHORITY_PHONE=\"https://yourtenant.b2clogin.com/yourtenant.onmicrosoft.com/B2C_1_signup_signin_otp\""
echo "NEXT_PUBLIC_AD_PUBLIC_REDIRECT_URL=\"http://localhost:3000/auth\""
echo "NEXT_PUBLIC_AD_PUBLIC_POST_LOGOUT_REDIRECT_URL=\"http://localhost:3000\""
echo "NEXT_PUBLIC_AD_PUBLIC_KNOWN_AUTHORITY=\"https://yourtenant.b2clogin.com\""
echo ""
echo "🚀 After updating .env.local, run: npm run dev"
