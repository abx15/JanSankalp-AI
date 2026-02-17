# Email OTP Testing Guide

## 🧪 Testing the Forgot Password Feature

### Prerequisites
1. Make sure your `.env` file has the `RESEND_API_KEY` configured
2. The development server should be running: `npm run dev`
3. You should have a test user account in the database

### Testing Steps

#### 1. Access Forgot Password Page
- Go to: http://localhost:3000/auth/signin
- Click on "Forgot your password?" link
- Or directly access: http://localhost:3000/auth/forgot-password

#### 2. Test Email Input
- Enter a valid email address (one that exists in your database)
- Click "Send OTP" button
- Check the console for development OTP display (for testing)
- Check your email for the OTP (should arrive within 1-2 minutes)

#### 3. Test OTP Verification
- After receiving the OTP, you'll be redirected to the OTP verification page
- Enter the 6-digit OTP
- The page includes:
  - Timer showing OTP expiry (10 minutes)
  - Resend OTP functionality (available after 1 minute)
  - Input validation (only numbers, max 6 digits)

#### 4. Test Password Reset
- After successful OTP verification, you'll be redirected to reset password page
- Enter a new password with the following requirements:
  - At least 8 characters
  - One uppercase letter
  - One lowercase letter
  - One number
  - One special character
- Confirm the new password
- Click "Reset Password"

#### 5. Test Sign In with New Password
- Try signing in with the new password
- It should work successfully

## 🔧 Debugging Email Issues

### If OTP is not received in email:

1. **Check Resend Configuration**
   - Verify `RESEND_API_KEY` is correct in `.env`
   - Check if the domain is verified in Resend dashboard

2. **Check Console Logs**
   - Look for console output showing the OTP (development mode)
   - Check for any error messages in the server console

3. **Check Spam Folder**
   - The OTP email might be in your spam/junk folder

4. **Test Email Service Directly**
   - You can test the email service by creating a simple test endpoint

### Common Issues and Solutions

#### Issue: "Failed to send OTP email"
- **Cause**: Resend API key issue or network problem
- **Solution**: Verify API key and check network connectivity

#### Issue: "Invalid or expired OTP"
- **Cause**: OTP might have expired (10 minutes) or was entered incorrectly
- **Solution**: Request a new OTP or double-check the entered code

#### Issue: "Invalid reset token"
- **Cause**: Session expired or browser storage was cleared
- **Solution**: Start the forgot password process again

## 📝 Notes for Production

### Security Improvements Needed:
1. **Replace in-memory OTP storage** with Redis or database table
2. **Add rate limiting** to prevent OTP spamming
3. **Implement proper session management** for reset tokens
4. **Add logging** for security audit
5. **Use environment-specific email configurations**

### Current Limitations:
- OTP storage uses global Map (not production-ready)
- No rate limiting on OTP requests
- Reset tokens stored in localStorage (not secure for production)

## 🚀 Quick Test Script

You can use this curl command to test the OTP endpoint directly:

```bash
# Test forgot password endpoint
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "your-test-email@example.com"}'

# Test OTP verification (replace with actual OTP and email)
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "your-test-email@example.com", "otp": "123456"}'

# Test password reset (replace with actual values)
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-test-email@example.com",
    "resetToken": "your-reset-token",
    "newPassword": "NewPassword123!"
  }'
```

## ✅ Success Criteria

The feature is working correctly if:
- [ ] User can request OTP with their email
- [ ] OTP email is received (within 2 minutes)
- [ ] OTP can be verified successfully
- [ ] User can reset their password
- [ ] New password works for sign in
- [ ] Error messages are displayed appropriately
- [ ] UI is responsive and user-friendly
