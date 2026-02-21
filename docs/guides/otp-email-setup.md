# OTP and Email Setup Guide

## Current Status ✅

The OTP verification and email functionality is now working correctly.

## What was Fixed

### 1. Email Configuration
- Added missing `RESEND_FROM_EMAIL` environment variable
- Updated email service to handle Resend API limitations
- Improved error handling for development vs production

### 2. OTP Storage
- Fixed OTP storage timing issue
- OTP is now stored before sending email
- Improved logging for debugging

### 3. Development Fallback
- Added proper handling for Resend's testing email limitation
- Console fallback shows OTP when email verification fails
- Clear error messages for users

## How It Works

### Email Service
- Uses Resend for email delivery
- In development, shows OTP in console when email fails
- Production requires verified domain

### OTP Flow
1. User requests password reset
2. System generates 6-digit OTP (10 min expiry)
3. OTP stored in memory + email sent
4. User enters OTP
5. System verifies and provides reset token

## Environment Variables Required

```env
# Email (RESEND)
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="onboarding@resend.dev" # or your verified domain
```

## Testing

### Test Email Service
```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "your@email.com", "testOTP": "123456"}'
```

### Test OTP Flow
```bash
# Request OTP
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'

# Verify OTP (use OTP from console)
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "otp": "123456"}'
```

## Production Setup

1. **Verify Domain**: Go to resend.com/domains and verify your domain
2. **Update FROM_EMAIL**: Change to your verified domain email
3. **Remove Debug**: Remove development debug logs
4. **Use Redis**: Replace memory storage with Redis for OTP

## Common Issues

### "Email service requires domain verification"
- Resend only allows sending to verified emails in testing
- Solution: Verify your domain or use console fallback in development

### "Invalid or expired OTP"
- OTP expires in 10 minutes
- Check server console for generated OTP in development
- Ensure correct OTP is entered

### "No account found with this email"
- User must be registered in the database
- Check user exists in the system

## Files Modified

- `.env` - Added RESEND_FROM_EMAIL
- `src/lib/email-service.ts` - Improved error handling
- `src/app/api/auth/forgot-password/route.ts` - Fixed OTP storage
- `src/app/api/auth/verify-otp/route.ts` - Already working correctly

## Next Steps

- [ ] Set up Redis for OTP storage in production
- [ ] Verify custom domain in Resend
- [ ] Add rate limiting for OTP requests
- [ ] Add SMS OTP option
