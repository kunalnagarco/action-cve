import { describe, it, expect, vi } from 'vitest'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

import { ACTION_SHORT_SUMMARY } from '../../src/constants'
import { Alert } from '../../src/entities'

import { sendAlertsToEmailSmtp } from '../../src/destinations/email'

const mockSendMail = vi.fn().mockResolvedValue(undefined)
const mockCreateTransport = vi.fn().mockReturnValue({ sendMail: mockSendMail })

vi.mock('nodemailer', () => ({
  createTransport: (...args: unknown[]) => mockCreateTransport(...args),
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
