# Azure B2C Authentication Setup

## Environment Variables Required

Create a `.env.local` file in your project root with the following variables:

```bash
# Azure B2C Authentication Configuration
NEXT_PUBLIC_AD_PUBLIC_CLIENT_ID="your-client-id-here"
NEXT_PUBLIC_AD_PUBLIC_AUTHORITY="https://your-tenant.b2clogin.com/your-tenant.onmicrosoft.com/B2C_1_signup_signin_vipps"
NEXT_PUBLIC_AD_PUBLIC_AUTHORITY_PHONE="https://your-tenant.b2clogin.com/your-tenant.onmicrosoft.com/B2C_1_signup_signin_otp"
NEXT_PUBLIC_AD_PUBLIC_REDIRECT_URL="http://localhost:3000"
NEXT_PUBLIC_AD_PUBLIC_POST_LOGOUT_REDIRECT_URL="http://localhost:3000"
NEXT_PUBLIC_AD_PUBLIC_KNOWN_AUTHORITY="https://your-tenant.b2clogin.com"
```

## Azure B2C Configuration

### 1. Create User Flows
- **Vipps SSO Flow**: `B2C_1_signup_signin_vipps`
- **OTP Flow**: `B2C_1_signup_signin_otp`

### 2. Configure Identity Providers
- **Vipps**: Set up Vipps as an external identity provider
- **Phone**: Configure phone number verification for OTP

### 3. Application Registration
- Register your application in Azure B2C
- Configure redirect URIs
- Set up API permissions

## Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/auth-test` to test authentication flows

3. Test both Vipps SSO and OTP authentication methods

## Features Implemented

- ✅ MSAL integration with Azure B2C
- ✅ Vipps SSO authentication
- ✅ OTP (One-Time Password) authentication
- ✅ Session persistence across browser tabs
- ✅ Automatic token refresh
- ✅ Error handling and loading states
- ✅ User profile management
- ✅ Route protection with AuthGuard
- ✅ Auth method detection and persistence

## Components

- `AuthContext`: Main authentication context with MSAL integration
- `AuthOptions`: Login options component
- `UserProfile`: User profile display component
- `AuthGuard`: Route protection component
- `useMsal`: MSAL instance hook
- `useAuthTokens`: Token management hook

## Usage

```tsx
import { useAuth, AuthGuard } from '@/components/features/auth';

function MyComponent() {
  const { isAuthenticated, user, loginWithVipps, loginWithOTP, logout } = useAuth();
  
  return (
    <AuthGuard requireAuth={true}>
      <div>Protected content</div>
    </AuthGuard>
  );
}
```
