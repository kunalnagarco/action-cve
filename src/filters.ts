import { Alert, AdvisorySeverity } from "./entities";

export const filterAlertsByAdvisorySeverity = (
  alerts: Alert[],
  severities: AdvisorySeverity[],
) => {
  if (severities.length === 0) {
    return alerts;
  }
  return alerts.filter((alert) =>
    alert.advisory !== undefined
      ? severities.includes(alert.advisory.severity)
      : false,
  );
};
