/* eslint-disable no-console */
import * as github from '@actions/github'
// import { Octokit } from '@octokit/rest'
import * as core from '@actions/core'

async function run(): Promise<void> {
  try {
    const token = core.getInput('token')
    const octokit = github.getOctokit(token)
    console.log(
      await octokit.request('PUT /repos/{owner}/{repo}/vulnerability-alerts', {
        owner: 'kunalnagarco',
        repo: 'action-cve',
        mediaType: {
          previews: ['dorian']
        }
      })
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
