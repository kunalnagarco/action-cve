/* eslint-disable i18n-text/no-en */
/* eslint-disable no-console */
import {
  ActionSet,
  AdaptiveCard,
  Column,
  ColumnSet,
  Container,
  OpenUrlAction,
  Spacing,
  TextBlock,
  TextWeight,
  Version,
} from 'adaptivecards'
import { ACTION_SHORT_SUMMARY } from '../constants'
import { Alert } from '../entities'
import { request } from '../utils'

const createTableHeaderCell = (text?: string, bold?: boolean): Column => {
  const cell = new Column()
  const cellItem = new TextBlock(text)
  if (bold) {
    cellItem.weight = TextWeight.Bolder
  }
  cell.addItem(cellItem)
  return cell
}

const createAlertAdvisoryButton = (url?: string): Column => {
  const cell = new Column()
  const viewAdvisoryActionSet = new ActionSet()
  const viewAdvisoryAction = new OpenUrlAction()
  viewAdvisoryAction.title = 'View Advisory'
  viewAdvisoryAction.url = url
  viewAdvisoryActionSet.addAction(viewAdvisoryAction)
  cell.addItem(viewAdvisoryActionSet)
  return cell
}

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

  const container = new Container()
  container.spacing = Spacing.Large
  container.style = 'emphasis'

  const tableHeaderColumnSet = new ColumnSet()
  tableHeaderColumnSet.addColumn(createTableHeaderCell('Package Name', true))
  tableHeaderColumnSet.addColumn(
    createTableHeaderCell('Vulnerability Version Range', true),
  )
  tableHeaderColumnSet.addColumn(createTableHeaderCell('Patched Version', true))
  tableHeaderColumnSet.addColumn(createTableHeaderCell('Severity', true))
  tableHeaderColumnSet.addColumn(createTableHeaderCell('Summary', true))
  tableHeaderColumnSet.addColumn(createTableHeaderCell('Action', true))
  container.addItem(tableHeaderColumnSet)

  for (const alert of alerts) {
    const alertColumnSet = new ColumnSet()
    alertColumnSet.addColumn(createTableHeaderCell(alert.packageName))
    alertColumnSet.addColumn(
      createTableHeaderCell(alert.vulnerability?.vulnerableVersionRange),
    )
    alertColumnSet.addColumn(
      createTableHeaderCell(alert.vulnerability?.firstPatchedVersion),
    )
    alertColumnSet.addColumn(createTableHeaderCell(alert.advisory?.severity))
    alertColumnSet.addColumn(createTableHeaderCell(alert.advisory?.summary))
    alertColumnSet.addColumn(createAlertAdvisoryButton(alert.advisory?.url))
    container.addItem(alertColumnSet)
  }

  adaptiveCard.addItem(container)

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
