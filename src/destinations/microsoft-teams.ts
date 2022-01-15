/* eslint-disable i18n-text/no-en */
import {
  Row,
  createAdaptiveCard,
  createColumn,
  createContainer,
  createLinkButton,
  createRow,
  createTextBlock,
  request,
} from '../utils'
import { ACTION_SHORT_SUMMARY } from '../constants'
import { Alert } from '../entities'

const createTableRow = (key: string, value: string): Row => {
  const row = createRow()
  const keyColumn = createColumn()
  keyColumn.addItem(createTextBlock(key, true))
  row.addColumn(keyColumn)
  const valueColumn = createColumn()
  valueColumn.addItem(createTextBlock(value))
  row.addColumn(valueColumn)
  return row
}

const createTableButtonRow = (url: string): Row => {
  const row = createRow()
  const keyColumn = createColumn()
  keyColumn.addItem(createTextBlock('Advisory URL', true))
  row.addColumn(keyColumn)
  const urlColumn = createColumn()
  urlColumn.addItem(createLinkButton('View Advisory', url))
  row.addColumn(urlColumn)
  return row
}

export const sendAlertsToMicrosoftTeams = async (
  webhookUrl: string,
  alerts: Alert[],
): Promise<void> => {
  const alertCount = alerts.length
  const repositoryOwner = alerts[0].repository.owner
  const repositoryName = alerts[0].repository.name

  const adaptiveCard = createAdaptiveCard()

  adaptiveCard.addItem(createTextBlock(ACTION_SHORT_SUMMARY))

  adaptiveCard.addItem(
    createTextBlock(
      `You have ${alertCount} vulnerabilities in ${repositoryOwner}/${repositoryName}`,
    ),
  )

  for (const alert of alerts) {
    const container = createContainer(true, true)
    container.addItem(createTableRow('Package Name', alert.packageName))
    container.addItem(
      createTableRow(
        'Vulnerability Version Range',
        alert.vulnerability?.vulnerableVersionRange || '',
      ),
    )
    container.addItem(
      createTableRow(
        'Patched Version',
        alert.vulnerability?.firstPatchedVersion || '',
      ),
    )
    container.addItem(
      createTableRow('Severity', alert.advisory?.severity || ''),
    )
    container.addItem(createTableRow('Summary', alert.advisory?.summary || ''))
    container.addItem(createTableButtonRow(alert.advisory?.url || ''))
    adaptiveCard.addItem(container)
  }

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

  await request(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}
