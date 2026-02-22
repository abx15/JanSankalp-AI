import { sendOTPEmail } from '@/lib/email-service'

describe('Email Service', () => {
  const mockSend = jest.fn()

  // Mock Resend before importing
  beforeAll(() => {
    jest.mock('resend', () => ({
      Resend: jest.fn().mockImplementation(() => ({
        emails: { send: mockSend },
      })),
    }))
  })

  beforeEach(() => {
    jest.clearAllMocks()
    mockSend.mockClear()
    // Set valid API key for testing
    process.env.RESEND_API_KEY = 're_valid_test_key'
  })

  it('should send OTP email successfully', async () => {
    mockSend.mockResolvedValue({
      data: { id: 'email-id' },
      error: null,
    })

    const result = await sendOTPEmail('test@example.com', 'Test User', '123456')

    expect(result.success).toBe(true)
    expect(result.data).toBeDefined()
    expect(mockSend).toHaveBeenCalledWith({
      from: 'onboarding@resend.dev',
      to: ['test@example.com'],
      subject: 'Password Reset OTP - JanSankalp AI',
      html: expect.stringContaining('123456'),
    })
  })

  it('should handle email sending failure', async () => {
    const mockError = { statusCode: 500, message: 'Email failed' }
    mockSend.mockResolvedValue({
      data: null,
      error: mockError,
    })

    const result = await sendOTPEmail('test@example.com', 'Test User', '123456')

    expect(result.success).toBe(false)
    expect(result.error).toEqual(mockError)
  })

  it('should include OTP in email content', async () => {
    const otp = '987654'
    mockSend.mockResolvedValue({
      data: { id: 'email-id' },
      error: null,
    })

    await sendOTPEmail('test@example.com', 'Test User', otp)

    expect(mockSend).toHaveBeenCalled()
    const callArgs = mockSend.mock.calls[0][0]
    expect(callArgs.html).toContain(otp)
    expect(callArgs.html).toContain('Password Reset Code')
    expect(callArgs.html).toContain('Test User')
  })
})
