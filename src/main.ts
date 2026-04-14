import { getInput, setFailed } from '@actions/core'
import { context } from '@actions/github'

import {
  sendAlertsToMicrosoftTeams,
  sendAlertsToPagerDuty,
  sendAlertsToSlack,
  sendAlertsToZenduty,
  sendAlertsToEmailSes,
  sendAlertsToEmailSmtp,
  validateSlackWebhookUrl,
} from './destinations'
import {
  fetchRepositoryAlerts,
  fetchOrgAlerts,
  fetchEnterpriseAlerts,
} from './fetch-alerts'
import { Alert } from './entities'

async function run(): Promise<void> {
  try {
    const token = getInput('token')
    const org = getInput('org')
    const enterprise = getInput('enterprise')
    const microsoftTeamsWebhookUrl = getInput('microsoft_teams_webhook')
    const slackWebhookUrl = getInput('slack_webhook')
    const pagerDutyIntegrationKey = getInput('pager_duty_integration_key')
    const zenDutyApiKey = getInput('zenduty_api_key')
    const zenDutyServiceId = getInput('zenduty_service_id')
    const zenDutyEscalationPolicyId = getInput('zenduty_escalation_policy_id')
    const emailFrom = getInput('email_from')
    const emailList = getInput('email_list')
    const emailSubject = getInput('email_subject')
    const emailTransportSesRegion = getInput('email_transport_ses_region')
    const emailTransportSesAccessKeyId = getInput('email_transport_ses_access_key_id')
    const emailTransportSesSecretAccessKey = getInput('email_transport_ses_secret_access_key')
    const emailTransportSmtpHost = getInput('email_transport_smtp_host')
    const emailTransportSmtpPort = parseInt(
      getInput('email_transport_smtp_port'),
      10,
    )
    const emailTransportSmtpUser = getInput('email_transport_smtp_user')
    const emailTransportSmtpPassword = getInput('email_transport_smtp_password')
    const count = parseInt(getInput('count'), 10)
    const severity = getInput('severity')
    const ecosystem = getInput('ecosystem')

    let alerts: Alert[] = []
    if (org) {
      alerts = await fetchOrgAlerts(token, org, severity, ecosystem, count)
    } else if (enterprise) {
      alerts = await fetchEnterpriseAlerts(
        token,
        org,
        severity,
        ecosystem,
        count,
      )
    } else {
      const { owner, repo } = context.repo
      alerts = await fetchRepositoryAlerts(
        token,
        repo,
        owner,
        severity,
        ecosystem,
        count,
      )
    }
    if (alerts.length > 0) {
      if (microsoftTeamsWebhookUrl) {
        await sendAlertsToMicrosoftTeams(microsoftTeamsWebhookUrl, alerts)
      }
      if (slackWebhookUrl) {
        if (!validateSlackWebhookUrl(slackWebhookUrl)) {
          setFailed(new Error('Invalid Slack Webhook URL'))
        } else {
          await sendAlertsToSlack(slackWebhookUrl, alerts)
        }
      }
      if (pagerDutyIntegrationKey) {
        await sendAlertsToPagerDuty(pagerDutyIntegrationKey, alerts)
      }
      if (zenDutyApiKey) {
        if (zenDutyServiceId && zenDutyEscalationPolicyId) {
          await sendAlertsToZenduty(
            zenDutyApiKey,
            zenDutyServiceId,
            zenDutyEscalationPolicyId,
            alerts,
          )
        } else {
          setFailed(
            new Error('Check your Zenduty Service ID and Escalation Policy ID'),
          )
        }
      }
      if (emailFrom && emailList) {
        const emailWikiLink =
          'https://github.com/kunalnagarco/action-cve/wiki/Send-alerts-to-email'
        if (emailTransportSesRegion && emailTransportSesAccessKeyId && emailTransportSesSecretAccessKey) {
          await sendAlertsToEmailSes(
            emailTransportSesRegion,
            emailTransportSesAccessKeyId,
            emailTransportSesSecretAccessKey,
            alerts,
            emailList,
            emailFrom,
            emailSubject,
          )
        } else if (emailTransportSmtpUser && emailTransportSmtpPassword) {
          const emailTransportSmtpConfig = {
            host: emailTransportSmtpHost,
            port: emailTransportSmtpPort,
            secure: emailTransportSmtpPort === 465 && true,
            auth: {
              user: emailTransportSmtpUser,
              pass: emailTransportSmtpPassword,
            },
          }
          await sendAlertsToEmailSmtp(
            emailTransportSmtpConfig,
            alerts,
            emailList,
            emailFrom,
            emailSubject,
          )
        } else {
          setFailed(
            new Error(
              `Invalid email config. Please check the wiki for more info: ${emailWikiLink}`,
            ),
          )
        }
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      setFailed(err)
    }
  }
}

void run()
