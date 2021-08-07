/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable github/array-foreach */
import {getOctokit} from '@actions/github'
import {info, getInput, setFailed} from '@actions/core'
import {IncomingWebhook} from '@slack/webhook'

async function run(): Promise<void> {
  try {
    const token = getInput('token')
    const webhookUrl = getInput('slack_webhook')
    const octokit = getOctokit(token)
    const result = await octokit.graphql(`
      query {
        organization(login:"kunalnagarco") {
          repository(name:"action-cve") {
            vulnerabilityAlerts(first: 20) {
              edges {
                node {
                  id
                  securityAdvisory {
                    id
                    description
                    cvss {
                      score
                      vectorString
                    }
                    permalink
                    severity
                    summary
                  }
                  securityVulnerability {
                    firstPatchedVersion {
                      identifier
                    }
                    package {
                      ecosystem
                      name
                    }
                    vulnerableVersionRange
                    advisory {
                      cvss {
                        score
                      }
                      summary
                    }
                  }
                }
              }
            }
          }
        }
      }
    `)
    const alerts = (result as any).organization.repository.vulnerabilityAlerts
      .edges
    if (alerts.length === 0) {
      info('No vulnerability alerts!')
    } else {
      const webhook = new IncomingWebhook(webhookUrl)
      const blocks: any = []
      alerts.forEach((alert: any) => {
        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `
              Package name: ${alert.node.securityVulnerability.package.name}
              Vulnerability Version Range: ${alert.node.securityVulnerability.vulnerableVersionRange}
              Severity: ${alert.node.securityAdvisory.severity}
              Summary: ${alert.node.securityVulnerability.advisory.summary}
            `
          }
        })
      })
      console.log(blocks)
      await webhook.send({
        blocks,
        text: `${alerts.length} vulnerabilities found!`
      })
      console.log(
        JSON.stringify(
          (result as any).organization.repository.vulnerabilityAlerts
        )
      )
    }
  } catch (err) {
    setFailed(err)
  }
}

run()
