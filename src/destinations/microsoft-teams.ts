/* eslint-disable no-console */
import {
  ActionSet,
  AdaptiveCard,
  Column,
  ColumnSet,
  OpenUrlAction,
  Spacing,
  TextBlock,
  Version,
} from 'adaptivecards'
import { ACTION_SHORT_SUMMARY } from '../constants'
import { Alert } from '../entities'
import { request } from '../utils'

export const sendAlertsToMicrosoftTeams = async (
  webhookUrl: string,
  alerts: Alert[],
): Promise<void> => {
  const alertCount = alerts.length
  const repositoryOwner = alerts[0].repository.owner
  const repositoryName = alerts[0].repository.name

  const adaptiveCard = new AdaptiveCard()
  adaptiveCard.version = new Version(1, 2)

  const titleTextBlock = new TextBlock(
    `${ACTION_SHORT_SUMMARY} - You have ${alertCount} vulnerabilities in ${repositoryOwner}/${repositoryName}`,
  )
  adaptiveCard.addItem(titleTextBlock)

  const leftColumnSet = new ColumnSet()
  leftColumnSet.separator = true
  leftColumnSet.spacing = Spacing.Medium

  const rightColumnSet = new ColumnSet()
  rightColumnSet.separator = true
  rightColumnSet.spacing = Spacing.Medium

  const leftColumnSetColumn = new Column()
  leftColumnSetColumn.width = 'stretch'

  const rightColumnSetColumn = new Column()
  rightColumnSetColumn.width = 'stretch'

  for (const alert of alerts) {
    leftColumnSetColumn.addItem(
      new TextBlock(`**Package name:** ${alert.packageName}`),
    )
    leftColumnSetColumn.addItem(
      new TextBlock(
        `*Vulnerability Version Range:* ${alert.vulnerability?.vulnerableVersionRange}`,
      ),
    )
    leftColumnSetColumn.addItem(
      new TextBlock(
        `*Patched Version:* ${alert.vulnerability?.firstPatchedVersion}`,
      ),
    )
    leftColumnSetColumn.addItem(
      new TextBlock(`*Severity:* ${alert.advisory?.severity}`),
    )
    leftColumnSetColumn.addItem(
      new TextBlock(`*Summary:* ${alert.advisory?.summary}`),
    )
    const viewAdvisoryActionSet = new ActionSet()
    const viewAdvisoryAction = new OpenUrlAction()
    // eslint-disable-next-line i18n-text/no-en
    viewAdvisoryAction.title = 'View Advisory'
    viewAdvisoryAction.url = alert.advisory?.url
    viewAdvisoryActionSet.addAction(viewAdvisoryAction)
    rightColumnSetColumn.addItem(viewAdvisoryActionSet)
  }

  leftColumnSet.addColumn(leftColumnSetColumn)
  rightColumnSet.addColumn(rightColumnSetColumn)

  adaptiveCard.addItem(leftColumnSet)
  adaptiveCard.addItem(rightColumnSet)

  const body = {
    type: 'message',
    attachments: [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        contentUrl: null,
        content: adaptiveCard.toJSON(),
      },
    ],
  }
  console.log(body)
  await request(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}
