import type { Centre, DashboardData } from './types'

export const pct = (current: number, target: number) => target > 0 ? current / target : 0
export const pctLabel = (current: number, target: number) => `${Math.round(pct(current, target) * 100)}%`
export const toGo = (current: number, target: number) => Math.max(target - current, 0)

export function status(current: number, target: number) {
  const p = pct(current, target)
  if (p >= 1) return { label: 'Ahead', tone: 'green' }
  if (p >= 0.9) return { label: 'On watch', tone: 'amber' }
  return { label: 'Behind', tone: 'red' }
}

export function toneClasses(tone: string) {
  if (tone === 'green') return 'bg-emerald-50 text-emerald-700 ring-emerald-200'
  if (tone === 'amber') return 'bg-amber-50 text-amber-700 ring-amber-200'
  if (tone === 'red') return 'bg-rose-50 text-rose-700 ring-rose-200'
  return 'bg-slate-50 text-slate-700 ring-slate-200'
}

export function groupSummaries(data: DashboardData) {
  const groups = Array.from(new Set(data.centres.map(c => c.group)))
  return groups.map(group => {
    const centres = data.centres.filter(c => c.group === group)
    return {
      group,
      registrationsCurrent: sum(centres, c => c.registrations.current),
      registrationsTarget: sum(centres, c => c.registrations.target),
      usedCurrent: sum(centres, c => c.used.current),
      usedTarget: sum(centres, c => c.used.target),
      bchCurrent: sum(centres, c => c.bch.current),
      bchTarget: sum(centres, c => c.bch.target),
    }
  })
}

export function totals(data: DashboardData) {
  return {
    registrationsCurrent: sum(data.centres, c => c.registrations.current),
    registrationsTarget: sum(data.centres, c => c.registrations.target),
    usedCurrent: sum(data.centres, c => c.used.current),
    usedTarget: sum(data.centres, c => c.used.target),
    bchCurrent: sum(data.centres, c => c.bch.current),
    bchTarget: sum(data.centres, c => c.bch.target),
  }
}

export function healthScore(c: Centre) {
  const reg = pct(c.registrations.current, c.registrations.target) * 45
  const used = pct(c.used.current, c.used.target) * 35
  const bch = pct(c.bch.current, c.bch.target) * 20
  return Math.min(100, Math.round(reg + used + bch))
}

export function executiveSummary(data: DashboardData) {
  const t = totals(data)
  const bottom = [...data.centres].sort((a,b) => pct(a.registrations.current, a.registrations.target) - pct(b.registrations.current, b.registrations.target))[0]
  const top = [...data.centres].sort((a,b) => pct(b.registrations.current, b.registrations.target) - pct(a.registrations.current, a.registrations.target))[0]
  const regPct = pctLabel(t.registrationsCurrent, t.registrationsTarget)
  if (t.registrationsCurrent === 0) {
    return `Q3 is set up with ${t.registrationsTarget} new registration target and ${t.usedTarget} used target. Upload the latest weekly file to move from target setup into live performance.`
  }
  return `Group registrations are currently at ${regPct}. ${top.name} is leading on registrations and ${bottom.name} needs the most attention against target.`
}

function sum<T>(arr: T[], fn: (x: T) => number) {
  return arr.reduce((acc, item) => acc + (Number(fn(item)) || 0), 0)
}
