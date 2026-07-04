import type { DashboardData } from '@/lib/types'

export const initialData: DashboardData = {
  organisationName: 'RRG Group',
  source: 'Weekly update.xlsx',
  quarter: 'Q3 2026',
  updatedAt: '2026-07-04',
  centres: [
    { name: 'Bolton', group: 'North CDA', registrations: { july: 0, august: 0, september: 0, current: 0, target: 105, fleet: 0, clcp: 0 }, used: { current: 0, target: 187 }, bch: { current: 0, target: 7 } },
    { name: 'Bury', group: 'North CDA', registrations: { july: 0, august: 0, september: 0, current: 0, target: 77, fleet: 0, clcp: 0 }, used: { current: 0, target: 163 }, bch: { current: 0, target: 5 } },
    { name: 'Rochdale', group: 'North CDA', registrations: { july: 0, august: 0, september: 0, current: 0, target: 85, fleet: 0, clcp: 0 }, used: { current: 0, target: 151 }, bch: { current: 0, target: 6 } },
    { name: 'SQ', group: 'North CDA', registrations: { july: 0, august: 0, september: 0, current: 0, target: 140, fleet: 0, clcp: 0 }, used: { current: 0, target: 178 }, bch: { current: 0, target: 8 } },
    { name: 'Bradford', group: 'West Yorkshire', registrations: { july: 0, august: 0, september: 0, current: 0, target: 105, fleet: 0, clcp: 0 }, used: { current: 0, target: 108 }, bch: { current: 1, target: 6 } },
    { name: 'Huddersfield', group: 'West Yorkshire', registrations: { july: 0, august: 0, september: 0, current: 0, target: 108, fleet: 0, clcp: 0 }, used: { current: 0, target: 139 }, bch: { current: 0, target: 7 } },
    { name: 'Silsden', group: 'West Yorkshire', registrations: { july: 0, august: 0, september: 0, current: 0, target: 34, fleet: 0, clcp: 0 }, used: { current: 0, target: 64 }, bch: { current: 0, target: 2 } }
  ]
}
