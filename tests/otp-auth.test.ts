import { NextRequest } from 'next/server'
import { POST } from '@/app/api/auth/forgot-password/route'
import { POST as VerifyOTP } from '@/app/api/auth/verify-otp/route'

// Mock global storage
const mockOtpStorage = new Map()
const mockRateLimitStorage = new Map()
;(global as any).otpStorage = mockOtpStorage
;(global as any).rateLimitStorage = mockRateLimitStorage

// Mock email service
jest.mock('@/lib/email-service', () => ({
  sendOTPEmail: jest.fn().mockResolvedValue({ success: true }),
}))

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  user: {
    findUnique: jest.fn(),
    update: jest.fn().mockResolvedValue({}), // Mock the update call
  },
}))

describe('OTP Authentication Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockOtpStorage.clear()
    mockRateLimitStorage.clear()
  })

  describe('Forgot Password', () => {
    it('should generate OTP for valid user', async () => {
      const { user } = require('@/lib/prisma')
      user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      })

      const request = new NextRequest('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('OTP sent to your email successfully')
      expect(user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      })
    })

    it('should return error for invalid email', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: '' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Email is required')
    })

    it('should handle user not found', async () => {
      const { user } = require('@/lib/prisma')
      user.findUnique.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: 'nonexistent@example.com' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('No account found with this email address')
    })
  })

  describe('OTP Verification', () => {
    it('should verify correct OTP', async () => {
      // Store OTP first
      mockOtpStorage.set('test@example.com', {
        userId: '1',
        otp: '123456',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        email: 'test@example.com',
      })

      const request = new NextRequest('http://localhost:3000/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', otp: '123456' }),
      })

      const response = await VerifyOTP(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('OTP verified successfully')
      expect(data.userId).toBe('1')
      expect(data.resetToken).toBeDefined()
    })

    it('should reject invalid OTP', async () => {
      mockOtpStorage.set('test@example.com', {
        userId: '1',
        otp: '123456',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        email: 'test@example.com',
      })

      const request = new NextRequest('http://localhost:3000/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', otp: '999999' }),
      })

      const response = await VerifyOTP(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid OTP. Please check and try again.')
    })

    it('should handle expired OTP', async () => {
      mockOtpStorage.set('test@example.com', {
        userId: '1',
        otp: '123456',
        expiresAt: new Date(Date.now() - 10 * 60 * 1000), // Expired
        email: 'test@example.com',
      })

      const request = new NextRequest('http://localhost:3000/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', otp: '123456' }),
      })

      const response = await VerifyOTP(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('OTP has expired. Please request a new one.')
    })

    it('should handle missing OTP data', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com' }),
      })

      const response = await VerifyOTP(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Email and OTP are required')
    })
  })

  describe('Complete Flow Integration', () => {
    it('should handle complete OTP flow', async () => {
      const { user } = require('@/lib/prisma')
      user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      })

      // Step 1: Request OTP
      const forgotRequest = new NextRequest('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com' }),
      })

      const forgotResponse = await POST(forgotRequest)
      expect(forgotResponse.status).toBe(200)

      // Check OTP was stored
      const storedOTP = mockOtpStorage.get('test@example.com')
      expect(storedOTP).toBeDefined()
      expect(storedOTP.otp).toMatch(/^\d{6}$/) // 6 digits
      expect(storedOTP.userId).toBe('1')

      // Step 2: Verify OTP
      const verifyRequest = new NextRequest('http://localhost:3000/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ 
          email: 'test@example.com', 
          otp: storedOTP.otp 
        }),
      })

      const verifyResponse = await VerifyOTP(verifyRequest)
      const verifyData = await verifyResponse.json()

      expect(verifyResponse.status).toBe(200)
      expect(verifyData.message).toBe('OTP verified successfully')
      expect(verifyData.resetToken).toBeDefined()
    })
  })
})
