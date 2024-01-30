import { Alert } from './../src/entities/alert'
import { AdvisorySeverity } from './../src/entities/advisory'
import { filterAlertsByAdvisorySeverity } from './../src/filters'

const createAlert = (severity: AdvisorySeverity): Alert => ({
  repository: {
    name: 'my-package',
    owner: 'myself',
  },
  packageName: 'foo',
  advisory: {
    cvssScore: 4,
    severity: severity,
    summary: 'Advisory Summary',
    description: 'A description',
    url: 'https://www.foo.com',
    publishedAt: '2020-01-01',
    updatedAt: '2020-02-01',
    withdrawnAt: '2020-03-01',
  },
  vulnerability: undefined,
  manifest: 'abcde',
  createdAt: '2020-01-01',
})

const createAlertWithoutAdvisory = (): Alert => ({
  repository: {
    name: 'my-package',
    owner: 'myself',
  },
  packageName: 'foo',
  advisory: undefined,
  vulnerability: undefined,
  manifest: 'abcde',
  createdAt: '2020-01-01',
})

describe('filterAlertsByAdvisorySeverity', () => {
  const alerts1 = createAlert('CRITICAL')
  const alerts2 = createAlert('HIGH')
  const alerts3 = createAlert('MODERATE')
  const alerts4 = createAlert('LOW')

  const alerts = [alerts1, alerts2, alerts3, alerts4]

  test('should filter alert by the given severity', () => {
    const severities: AdvisorySeverity[] = ['CRITICAL', 'HIGH']

    const expected = [alerts1, alerts2]

    expect(filterAlertsByAdvisorySeverity(alerts, severities)).toEqual(expected)
  })

  test('should not filter alerts with an empty array of severities', () => {
    const severities: AdvisorySeverity[] = []

    const expected = alerts

    expect(filterAlertsByAdvisorySeverity(alerts, severities)).toEqual(expected)
  })

  test("should not filter alerts when alert doesn't have severity", () => {
    const severities: AdvisorySeverity[] = ['CRITICAL']
    const alertsWithoutAdvisory = createAlertWithoutAdvisory()

    const expected = [alertsWithoutAdvisory]

    expect(
      filterAlertsByAdvisorySeverity([alertsWithoutAdvisory], severities),
    ).toEqual(expected)
  })
})
