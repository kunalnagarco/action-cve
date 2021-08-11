## @kunalnagarco/action-cve

A [GitHub action](https://github.com/features/actions) that sends Dependabot Vulnerability Alerts to multiple sources, starting with Slack.

### Usage

```yaml
name: 'Check for Vulnerabilities'

on:
  schedule:
    - cron: '0 */6 * * *' # every 6 hours

jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      # X.X.X - Latest version available at:
      #         https://github.com/kunalnagarco/action-cve/releases
      - uses: kunalnagarco/action-cve@vX.X.X
        with:
          # Create a Personal Access Token here:
          #     https://github.com/settings/tokens
          token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
          # Create a Slack Incoming Webhook URL:
          #     https://slack.com/apps/A0F7XDUAZ-incoming-webhooks
          slack_webhook: ${{ secrets.SLACK_WEBHOOK }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
