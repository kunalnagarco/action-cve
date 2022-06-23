/* eslint-disable i18n-text/no-en */
// import { ACTION_SHORT_SUMMARY, ACTION_URL } from '../constants'
import { Alert } from '../entities'
import { createTransport } from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

const createTable = (alerts: Alert[]): string => {
  return `
    <table>
      <thead>
        <th>Package name</th>
        <th>Vulnerability Version Range</th>
        <th>Patched Version</th>
        <th>Severity</th>
        <th>Summary</th>
        <th></th>
      </thead>
      <tbody>
        ${alerts.map((alert) => {
          createTableRow(alert)
        })}
      </tbody>
    </table>

  `
}

const createTableRow = (alert: Alert): string => {
  return `
    <tr>
      <td>${alert.packageName}</td>
      <td>${alert.vulnerability?.vulnerableVersionRange}</td>
      <td>${alert.vulnerability?.firstPatchedVersion}</td>
      <td>${alert.advisory?.severity}</td>
      <td>${alert.advisory?.summary}</td>
      <td><a href="${alert.advisory?.url}">View</a></td>
    </tr>
  `
}

export const sendAlertsToEmailSmtp = async (
  config: SMTPTransport.Options,
  alerts: Alert[],
  emailList: string,
  emailFrom: string,
  subject?: string,
): Promise<void> => {
  const transporter = createTransport(config)
  await transporter.sendMail({
    from: emailFrom,
    to: emailList,
    subject:
      subject ||
      `You have ${alerts.length} vulnerabilities in ${alerts[0].repository.owner}/${alerts[0].repository.name}`,
    text: createTable(alerts),
  })
}
