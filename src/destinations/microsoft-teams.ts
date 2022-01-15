/* eslint-disable i18n-text/no-en */
/* eslint-disable no-console */
import {
  Row,
  createAdaptiveCard,
  createColumn,
  createContainer,
  // createLinkButton,
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

// const createTableHeader = (): Row => {
//   const row = createRow()
//   const packageNameColumn = createColumn()
//   packageNameColumn.addItem(createTextBlock('Package Name', true))
//   row.addColumn(packageNameColumn)
//   const vulnerabilityVersionRangeColumn = createColumn()
//   vulnerabilityVersionRangeColumn.addItem(
//     createTextBlock('Vulnerability Version Range', true),
//   )
//   row.addColumn(vulnerabilityVersionRangeColumn)
//   const patchedVersionColumn = createColumn()
//   patchedVersionColumn.addItem(createTextBlock('Patched Version', true))
//   row.addColumn(patchedVersionColumn)
//   const severityColumn = createColumn()
//   severityColumn.addItem(createTextBlock('Severity', true))
//   row.addColumn(severityColumn)
//   const summaryColumn = createColumn()
//   summaryColumn.addItem(createTextBlock('Summary', true))
//   row.addColumn(summaryColumn)
//   const actionColumn = createColumn()
//   actionColumn.addItem(createTextBlock('Action', true))
//   row.addColumn(actionColumn)
//   return row
// }

// const createTableAlertRow = (alert: Alert): Row => {
//   const row = createRow()
//   const packageNameColumn = createColumn()
//   packageNameColumn.addItem(createTextBlock(alert.packageName))
//   row.addColumn(packageNameColumn)
//   const vulnerabilityVersionRangeColumn = createColumn()
//   vulnerabilityVersionRangeColumn.addItem(
//     createTextBlock(alert.vulnerability?.vulnerableVersionRange || ''),
//   )
//   row.addColumn(vulnerabilityVersionRangeColumn)
//   const patchedVersionColumn = createColumn()
//   patchedVersionColumn.addItem(
//     createTextBlock(alert.vulnerability?.firstPatchedVersion || ''),
//   )
//   row.addColumn(patchedVersionColumn)
//   const severityColumn = createColumn()
//   severityColumn.addItem(createTextBlock(alert.advisory?.severity || ''))
//   row.addColumn(severityColumn)
//   const summaryColumn = createColumn()
//   summaryColumn.addItem(createTextBlock(alert.advisory?.summary || ''))
//   row.addColumn(summaryColumn)
//   const actionColumn = createColumn()
//   actionColumn.addItem(
//     createLinkButton('View Advisory', alert.advisory?.url || ''),
//   )
//   row.addColumn(actionColumn)
//   return row
// }

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

  const container = createContainer(true, true)
  // container.addItem(createTableHeader())

  for (const alert of alerts) {
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
    // container.addItem(createTableRow('Summary', alert.advisory?.summary || ''))
    // container.addItem(createTableRow('Advisory URL', alert.advisory?.url || ''))
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
  console.log(JSON.stringify(body))
  await request(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}
