import { describe, it, expect, vi, beforeEach } from 'vitest'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

import { ACTION_SHORT_SUMMARY } from '../../src/constants'
import { Alert } from '../../src/entities'
import { sendAlertsToEmailSes, sendAlertsToEmailSmtp } from '../../src/destinations/email'

const mockSendMail = vi.fn().mockResolvedValue(undefined)
const mockCreateTransport = vi.fn().mockReturnValue({ sendMail: mockSendMail })
const mockSESClient = vi.fn()

vi.mock('nodemailer', () => ({
  createTransport: (...args: unknown[]) => mockCreateTransport(...args),
}))

vi.mock('@aws-sdk/client-ses', () => ({
  SESClient: function (...args: unknown[]) {
    return mockSESClient(...args)
  },
  SendRawEmailCommand: vi.fn(),
}))

const mockAlert: Alert = {
  repository: { name: 'my-repo', owner: 'my-org' },
  packageName: 'lodash',
  advisory: {
    cvssScore: 9.8,
    severity: 'CRITICAL',
    summary: 'Prototype Pollution',
    description: 'Affected versions of lodash are vulnerable',
    url: 'https://github.com/advisories/GHSA-xyz',
    publishedAt: '2021-01-01T00:00:00Z',
    updatedAt: '2021-01-02T00:00:00Z',
  },
  vulnerability: {
    firstPatchedVersion: '4.17.21',
    vulnerableVersionRange: '< 4.17.21',
  },
  createdAt: '2021-01-01T00:00:00Z',
}

const smtpConfig: SMTPTransport.Options = {
  host: 'smtp.gmail.com',
  port: 587,
  auth: { user: 'user@example.com', pass: 'secret' },
}

describe('sendAlertsToEmailSes', () => {
  beforeEach(() => {
    mockSendMail.mockClear()
    mockCreateTransport.mockClear()
    mockSESClient.mockClear()
  })

  it('creates an SESClient with the provided credentials', async () => {
    await sendAlertsToEmailSes('us-east-1', 'KEY_ID', 'SECRET', [mockAlert], 'to@example.com', 'from@example.com')
    expect(mockSESClient).toHaveBeenCalledWith({
      region: 'us-east-1',
      credentials: { accessKeyId: 'KEY_ID', secretAccessKey: 'SECRET' },
    })
  })

  it('creates a transport with the SES client', async () => {
    await sendAlertsToEmailSes('us-east-1', 'KEY_ID', 'SECRET', [mockAlert], 'to@example.com', 'from@example.com')
    expect(mockCreateTransport).toHaveBeenCalledWith(
      expect.objectContaining({ SES: expect.objectContaining({ aws: expect.anything() }) }),
    )
  })

  it('sends mail with the correct from and bcc fields', async () => {
    await sendAlertsToEmailSes('us-east-1', 'KEY_ID', 'SECRET', [mockAlert], 'to@example.com', 'from@example.com')
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({ from: 'from@example.com', bcc: 'to@example.com' }),
    )
  })

  it('uses the default subject when none is provided', async () => {
    await sendAlertsToEmailSes('us-east-1', 'KEY_ID', 'SECRET', [mockAlert], 'to@example.com', 'from@example.com')
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({ subject: ACTION_SHORT_SUMMARY }),
    )
  })

  it('uses a custom subject when provided', async () => {
    await sendAlertsToEmailSes('us-east-1', 'KEY_ID', 'SECRET', [mockAlert], 'to@example.com', 'from@example.com', 'Security Alert')
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({ subject: 'Security Alert' }),
    )
  })
})

describe('sendAlertsToEmailSmtp', () => {
  it('creates a transport with the provided SMTP config', async () => {
    await sendAlertsToEmailSmtp(smtpConfig, [mockAlert], 'to@example.com', 'from@example.com')
    expect(mockCreateTransport).toHaveBeenCalledWith(smtpConfig)
  })

  it('sends mail with the correct from and bcc fields', async () => {
    await sendAlertsToEmailSmtp(smtpConfig, [mockAlert], 'to@example.com', 'from@example.com')
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'from@example.com',
        bcc: 'to@example.com',
      }),
    )
  })

  it('uses the default subject when none is provided', async () => {
    await sendAlertsToEmailSmtp(smtpConfig, [mockAlert], 'to@example.com', 'from@example.com')
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({ subject: ACTION_SHORT_SUMMARY }),
    )
  })

  it('uses a custom subject when provided', async () => {
    await sendAlertsToEmailSmtp(
      smtpConfig,
      [mockAlert],
      'to@example.com',
      'from@example.com',
      'Security Alert',
    )
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({ subject: 'Security Alert' }),
    )
  })

  it('includes package name in the HTML body', async () => {
    await sendAlertsToEmailSmtp(smtpConfig, [mockAlert], 'to@example.com', 'from@example.com')
    const { html } = mockSendMail.mock.calls[0][0]
    expect(html).toContain('lodash')
    expect(html).toContain('CRITICAL')
    expect(html).toContain('my-org/my-repo')
  })
})
