/* eslint-disable no-console */
/* eslint-disable i18n-text/no-en */
// import { ACTION_SHORT_SUMMARY, ACTION_URL } from '../constants'
import { Alert } from '../entities'
import { createTransport } from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

export const sendAlertsToEmailSmtp = async (
  config: SMTPTransport.Options,
  alerts: Alert[],
  emailList: string,
  emailFrom: string,
  subject?: string,
): Promise<void> => {
  console.log(typeof config, config.from)
  const transporter = createTransport(config)
  await transporter.sendMail({
    from: emailFrom,
    to: emailList,
    subject:
      subject ||
      `You have ${alerts.length} vulnerabilities in ${alerts[0].repository.owner}/${alerts[0].repository.name}`,
    text: `Hello World!`,
  })
}
