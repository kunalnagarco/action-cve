![image](/icons/marketing.png)

## @kunalnagarco/action-cve

A [GitHub action](https://github.com/features/actions) that sends Dependabot Vulnerability Alerts to multiple sources:

- Slack
- PagerDuty

## Getting Started

There are a few things you need to setup on the repository before this action can be used:

1. [Enable Dependabot Alerts](https://docs.github.com/en/code-security/supply-chain-security/managing-vulnerabilities-in-your-projects-dependencies/configuring-dependabot-security-updates#managing-dependabot-security-updates-for-your-repositories) for the repository.

2. Create a [GitHub Personal Access Token](https://github.com/settings/tokens) and add it to the [repository's secrets](https://docs.github.com/en/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-a-repository).

### Send alerts to Slack

Ideally, you'd want to send these alerts to a dedicated Slack channel. Create a [Webhook URL](https://api.slack.com/messaging/webhooks) for the channel and add it to the repository's secrets. You may also use the [Incoming Webhooks Slack app](https://slack.com/apps/A0F7XDUAZ-incoming-webhooks?tab=more_info) that makes it a lot easier.

### Send alerts to PagerDuty

Create a [Service Integration](https://support.pagerduty.com/docs/services-and-integrations#section-events-api-v2) in PagerDuty for the GitHub app. This will give you an Integration key that can be used in the action.

## Usage

```yaml
name: 'Check for Vulnerabilities'

on:
  schedule:
    - cron: '0 */6 * * *' # every 6 hours

jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      # X.X.X - Latest version available at: https://github.com/kunalnagarco/action-cve/releases
      - uses: kunalnagarco/action-cve@vX.X.X
        with:
          token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
          slack_webhook: ${{ secrets.SLACK_WEBHOOK }}
          pager_duty_integration_key: ${{ secrets.PAGER_DUTY_INTEGRATION_KEY }}
          count: 10
```

## Action Inputs

| Input                        | Description                                                                                                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `token`                      | GitHub Personal Access Token. Create one [here](https://github.com/settings/tokens)                                                                                 |
| `slack_webhook`              | Slack Incoming Webhook URL. More info [here](https://slack.com/apps/A0F7XDUAZ-incoming-webhooks)                                                                    |
| `pager_duty_integration_key` | Pager Duty Service Integration Key. Also known as Routing key. More info [here](https://support.pagerduty.com/docs/services-and-integrations#section-events-api-v2) |
| `count`                      | Number of alerts to send. Defaults to `20`                                                                                                                          |

## Attributions

- Bug icon: Made by Freepik from [https://www.flaticon.com/](https://www.flaticon.com/)
