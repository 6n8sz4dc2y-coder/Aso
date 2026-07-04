export type CentreMetric = {
  current: number
  target: number
}

export type Registrations = CentreMetric & {
  july: number
  august: number
  september: number
  fleet: number
  clcp: number
}

export type Centre = {
  name: string
  group: string
  registrations: Registrations
  used: CentreMetric
  bch: CentreMetric
  enquiries?: number
  conversion?: number
}

export type DashboardData = {
  organisationName: string
  quarter: string
  updatedAt: string
  source: string
  centres: Centre[]
}
