/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as github from '@actions/github'
// import { Octokit } from '@octokit/rest'
import * as core from '@actions/core'

async function run(): Promise<void> {
  try {
    const token = core.getInput('token')
    const octokit = github.getOctokit(token)
    const result = await octokit.graphql(`
      query {
        organization(login:"kunalnagarco") {
          repository(name:"action-cve") {
            vulnerabilityAlerts(first: 20) {
              edges {
                node {
                  id
                  securityVulnerability {
                    advisory {
                      cvss {
                        score
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `)
    // const result = await octokit.rest.activity.listRepoEvents({
    //   owner: 'kunalnagarco',
    //   repo: 'action-cve'
    // })
    // await octokit.request('PUT /repos/{owner}/{repo}/vulnerability-alerts', {
    //   owner: 'kunalnagarco',
    //   repo: 'action-cve',
    //   mediaType: {
    //     previews: ['dorian']
    //   }
    // })
    console.log(
      JSON.stringify(
        (result as any).organization.repository.vulnerabilityAlerts
      )
    )
  } catch (err) {
    console.log(err)
  }

  // console.log(github.context.payload.repository_vulnerability_alert)
  // const regexPattern = new RegExp(
  //   /^(?<type>build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test|¯\\_\(ツ\)_\/¯)(?<scope>\(\w+\)?((?=:\s)|(?=!:\s)))?(?<breaking>!)?(?<subject>:\s.*)?|^(?<merge>Merge \w+)/
  // )
  // const title: string = github.context.payload.pull_request?.title
  // if (!regexPattern.test(title)) {
  //   core.setFailed('Invalid PR Title!')
  // }
}

run()
