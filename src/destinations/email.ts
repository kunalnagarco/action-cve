import { ACTION_SHORT_SUMMARY, ACTION_URL } from '../constants'
import { Alert, getFullRepositoryNameFromAlert } from '../entities'
import { createTransport } from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

const createTable = (alerts: Alert[]): string => {
  let rowData = ''
  for (const alert of alerts) {
    rowData += createTableRow(alert)
  }
  return `
    <table border="1" cellpadding="10" width="100%">
      <thead>
        <th>Package name</th>
        <th>Vulnerability Version Range</th>
        <th>Patched Version</th>
        <th>Severity</th>
        <th>Summary</th>
        <th></th>
      </thead>
      <tbody>
        ${rowData}
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

const createEmailBody = (alerts: Alert[]): string => {
  return `
    <p>Hello,</p>
    <p>You are receiving this message as you have set up email notifications for vulnerabilities in <b>${getFullRepositoryNameFromAlert(
      alerts[0],
    )}</b> via <a href="${ACTION_URL}">${ACTION_SHORT_SUMMARY}</a>.</p>
    ${createTable(alerts)}
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
    bcc: emailList,
    subject:
      subject ||
      `${ACTION_SHORT_SUMMARY} - ${
        alerts.length
      } vulnerabilities in ${getFullRepositoryNameFromAlert(alerts[0])}`,
    html: createEmailBody(alerts),
  })
}
