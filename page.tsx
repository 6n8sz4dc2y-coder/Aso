'use client'

import { useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { initialData } from '@/data/initialData'
import type { Centre, DashboardData } from '@/lib/types'
import { executiveSummary, groupSummaries, healthScore, pct, pctLabel, toGo, totals } from '@/lib/calculations'
import { parseWeeklyUpdate } from '@/lib/excel'
import { KpiCard } from '@/components/KpiCard'
import { CentreTable } from '@/components/CentreTable'
import { ProgressBar } from '@/components/ProgressBar'

export default function Home() {
  const [data, setData] = useState<DashboardData>(initialData)
  const [selected, setSelected] = useState<Centre | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('rrg-dashboard-data')
    if (saved) setData(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('rrg-dashboard-data', JSON.stringify(data))
  }, [data])

  const total = useMemo(() => totals(data), [data])
  const groups = useMemo(() => groupSummaries(data), [data])
  const chartData = data.centres.map(c => ({ centre: c.name, newPct: Math.round(pct(c.registrations.current, c.registrations.target) * 100), usedPct: Math.round(pct(c.used.current, c.used.target) * 100) }))
  const topCentre = [...data.centres].sort((a,b) => healthScore(b) - healthScore(a))[0]
  const watchCentre = [...data.centres].sort((a,b) => healthScore(a) - healthScore(b))[0]

  async function onFile(file: File) {
    setUploading(true)
    try {
      const parsed = await parseWeeklyUpdate(file)
      setData(parsed)
      setSelected(null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex max-w-7xl gap-6 p-4 md:p-6">
        <aside className="hidden w-64 shrink-0 rounded-[2rem] bg-slate-950 p-5 text-white md:block">
          <div className="text-xl font-semibold">RRG Group</div>
          <div className="mt-1 text-sm text-slate-400">Dashboard</div>
          <nav className="mt-10 space-y-2 text-sm">
            {['Dashboard', 'Registrations', 'Used Cars', 'Centres', 'Performance'].map(item => <div key={item} className="rounded-2xl px-4 py-3 text-slate-200 hover:bg-white/10">{item}</div>)}
          </nav>
          <div className="mt-10 rounded-3xl bg-white/10 p-4 text-sm text-slate-300">
            <div className="font-medium text-white">Source</div>
            <div className="mt-1 break-words">{data.source}</div>
            <div className="mt-3 text-xs">Updated {data.updatedAt}</div>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium text-slate-500">{data.quarter}</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">RRG Group Dashboard</h1>
            </div>
            <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-soft hover:bg-slate-800">
              {uploading ? 'Loading…' : 'Upload Weekly Update'}
              <input className="hidden" type="file" accept=".xlsx,.xls" onChange={e => e.target.files?.[0] && onFile(e.target.files[0])} />
            </label>
          </header>

          <section className="mb-6 rounded-[2rem] bg-slate-950 p-6 text-white shadow-soft">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Executive summary</p>
                <p className="mt-3 max-w-3xl text-2xl font-semibold leading-snug">{executiveSummary(data)}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4 min-w-44">
                <div className="text-sm text-slate-300">Overall Health</div>
                <div className="mt-2 text-4xl font-semibold">{Math.round(data.centres.reduce((a,c) => a + healthScore(c), 0) / data.centres.length)}</div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <KpiCard title="New Registrations" value={pctLabel(total.registrationsCurrent, total.registrationsTarget)} subtitle={`${total.registrationsCurrent} / ${total.registrationsTarget}`} progress={pct(total.registrationsCurrent, total.registrationsTarget)} />
            <KpiCard title="Used Cars" value={pctLabel(total.usedCurrent, total.usedTarget)} subtitle={`${total.usedCurrent} / ${total.usedTarget}`} progress={pct(total.usedCurrent, total.usedTarget)} />
            <KpiCard title="Centre Fleet BCH" value={pctLabel(total.bchCurrent, total.bchTarget)} subtitle={`${total.bchCurrent} / ${total.bchTarget}`} progress={pct(total.bchCurrent, total.bchTarget)} />
          </section>

          <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {groups.map(g => (
              <div key={g.group} className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-200/70">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-slate-950">{g.group}</h2>
                  <span className="text-sm font-semibold text-slate-500">{pctLabel(g.registrationsCurrent, g.registrationsTarget)}</span>
                </div>
                <div className="mt-4"><ProgressBar value={pct(g.registrationsCurrent, g.registrationsTarget)} /></div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-slate-50 p-3"><div className="text-slate-500">New to go</div><div className="mt-1 font-semibold">{toGo(g.registrationsCurrent, g.registrationsTarget)}</div></div>
                  <div className="rounded-2xl bg-slate-50 p-3"><div className="text-slate-500">Used</div><div className="mt-1 font-semibold">{pctLabel(g.usedCurrent, g.usedTarget)}</div></div>
                </div>
              </div>
            ))}
          </section>

          <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-200/70">
              <h2 className="font-semibold text-slate-950">Top performer</h2>
              <p className="mt-4 text-4xl font-semibold">{topCentre.name}</p>
              <p className="mt-1 text-slate-500">Health score {healthScore(topCentre)}/100</p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-200/70">
              <h2 className="font-semibold text-slate-950">Needs attention</h2>
              <p className="mt-4 text-4xl font-semibold">{watchCentre.name}</p>
              <p className="mt-1 text-slate-500">Health score {healthScore(watchCentre)}/100</p>
            </div>
          </section>

          <section className="mt-6 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-200/70">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-slate-950">Performance chart</h2>
              <p className="text-sm text-slate-500">New and used vs target</p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="centre" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="newPct" name="New %" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="usedPct" name="Used %" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">Centres</h2>
              <p className="text-sm text-slate-500">Click a centre for detail</p>
            </div>
            <CentreTable centres={data.centres} onSelect={setSelected} />
          </section>

          {selected && (
            <section className="mt-6 rounded-[2rem] bg-white p-6 shadow-soft ring-1 ring-slate-200/70">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">Centre detail</p>
                  <h2 className="mt-1 text-3xl font-semibold tracking-tight">{selected.name}</h2>
                </div>
                <button className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold" onClick={() => setSelected(null)}>Close</button>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <KpiCard title="New Registrations" value={pctLabel(selected.registrations.current, selected.registrations.target)} subtitle={`${selected.registrations.current} / ${selected.registrations.target}`} progress={pct(selected.registrations.current, selected.registrations.target)} />
                <KpiCard title="Used Cars" value={pctLabel(selected.used.current, selected.used.target)} subtitle={`${selected.used.current} / ${selected.used.target}`} progress={pct(selected.used.current, selected.used.target)} />
                <KpiCard title="BCH" value={pctLabel(selected.bch.current, selected.bch.target)} subtitle={`${selected.bch.current} / ${selected.bch.target}`} progress={pct(selected.bch.current, selected.bch.target)} />
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                {[['July', selected.registrations.july], ['August', selected.registrations.august], ['September', selected.registrations.september], ['Fleet', selected.registrations.fleet]].map(([label, value]) => (
                  <div key={String(label)} className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">{label}</div>
                    <div className="mt-2 text-2xl font-semibold">{String(value)}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </section>
      </div>
    </main>
  )
}
