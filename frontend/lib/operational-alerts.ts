export type OperationalAlertLevel = 'info' | 'warning' | 'critical'

export type OperationalAlert = {
  id: string
  title: string
  message: string
  level: OperationalAlertLevel
  href: string
  meta?: string
}

export type OperationalAlertInput = {
  pendingBilling: number
  missingDocuments: number
  openNcs: number
  inquiriesFollowUpCount?: number
  backendHealthy?: boolean
  patientsCount?: number
}

export function buildOperationalAlerts(input: OperationalAlertInput) {
  const alerts: OperationalAlert[] = []

  if (input.pendingBilling > 0) {
    alerts.push({
      id: 'pending-billing',
      title: 'Pending billing',
      message: `${input.pendingBilling} invoice${input.pendingBilling > 1 ? 's are' : ' is'} awaiting resolution.`,
      level: 'warning',
      href: '/billing',
      meta: 'Billing queue',
    })
  }

  if (input.missingDocuments > 0) {
    alerts.push({
      id: 'missing-documents',
      title: 'Missing documents',
      message: `${input.missingDocuments} document${input.missingDocuments > 1 ? 's are' : ' is'} still missing across patient files.`,
      level: 'warning',
      href: '/patient-profile',
      meta: 'MRD / Records',
    })
  }

  if (input.openNcs > 0) {
    alerts.push({
      id: 'open-ncs',
      title: 'Open non-conformances',
      message: `${input.openNcs} issue${input.openNcs > 1 ? 's need' : ' needs'} follow-up.`,
      level: 'critical',
      href: '/qa',
      meta: 'Quality review',
    })
  }

  if (input.inquiriesFollowUpCount && input.inquiriesFollowUpCount > 0) {
    alerts.push({
      id: 'inquiry-followup',
      title: 'Inquiry follow-ups due',
      message: `${input.inquiriesFollowUpCount} inquir${input.inquiriesFollowUpCount > 1 ? 'ies require' : 'y requires'} follow-up today.`,
      level: 'warning',
      href: '/inquiry',
      meta: 'Front Desk / Follow-ups',
    })
  }

  if (input.backendHealthy === false) {
    alerts.push({
      id: 'backend-connection',
      title: 'Backend connectivity issue',
      message: 'The dashboard could not reach the backend service. Check the connection and persistence flow.',
      level: 'critical',
      href: '/dashboard',
      meta: 'System health',
    })
  }

  if (alerts.length === 0) {
    alerts.push({
      id: 'system-healthy',
      title: 'System healthy',
      message: 'No open issues were detected in the current snapshot.',
      level: 'info',
      href: '/',
      meta: `Patients tracked: ${input.patientsCount ?? 0}`,
    })
  }

  return alerts
}
