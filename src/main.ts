import { context, getOctokit } from '@actions/github'
import { info, getInput, setFailed } from '@actions/core'
import { IncomingWebhook } from '@slack/webhook'

async function run(): Promise<void> {
  try {
    const token = getInput('token')
    const webhookUrl = getInput('slack_webhook')
    const octokit = getOctokit(token)
    const owner = context.repo.owner
    const repo = context.repo.repo
    const result = await octokit.graphql(`
      query {
        organization(login:"${owner}") {
          repository(name:"${repo}") {
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
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `You have ${alerts.length} vulnerabilities in *${owner}/${repo}*`,
        },
      })
      blocks.push({
        type: 'divider',
      })
      alerts.forEach((alert: any) => {
        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `
*Package name:* ${alert.node.securityVulnerability.package.name}
*Vulnerability Version Range:* ${alert.node.securityVulnerability.vulnerableVersionRange}
*Fixed In:* ${alert.node.securityVulnerability.firstPatchedVersion.identifier}
*Severity:* ${alert.node.securityAdvisory.severity}
*Summary:* ${alert.node.securityVulnerability.advisory.summary}
            `,
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View Advisory',
              emoji: true,
            },
            style: 'danger',
            url: alert.node.securityAdvisory.permalink,
          },
        })
      })
      console.log(blocks)
      await webhook.send({
        blocks,
        icon_url:
          'https://github.com/kunalnagarco/action-cve/raw/main/icons/ladybug.png',
        username: 'GitHub Action - @kunalnagarco/action-cve',
      })
      console.log(
        JSON.stringify(
          (result as any).organization.repository.vulnerabilityAlerts,
        ),
      )
    }
  } catch (err) {
    setFailed(err)
  }
}

run()
