import type { Centre } from '@/lib/types'
import { pct, pctLabel, status, toGo, toneClasses } from '@/lib/calculations'
import { ProgressBar } from './ProgressBar'

export function CentreTable({ centres, onSelect }: { centres: Centre[], onSelect: (centre: Centre) => void }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-slate-200/70">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-4">Centre</th>
              <th className="px-5 py-4">CDA</th>
              <th className="px-5 py-4 text-right">New</th>
              <th className="px-5 py-4 text-right">Target</th>
              <th className="px-5 py-4 text-right">%</th>
              <th className="px-5 py-4">Progress</th>
              <th className="px-5 py-4 text-right">To go</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[...centres].sort((a,b) => pct(b.registrations.current,b.registrations.target) - pct(a.registrations.current,a.registrations.target)).map((c) => {
              const s = status(c.registrations.current, c.registrations.target)
              return (
                <tr key={c.name} className="cursor-pointer hover:bg-slate-50" onClick={() => onSelect(c)}>
                  <td className="px-5 py-4 font-semibold text-slate-950">{c.name}</td>
                  <td className="px-5 py-4 text-slate-500">{c.group}</td>
                  <td className="px-5 py-4 text-right font-medium">{c.registrations.current}</td>
                  <td className="px-5 py-4 text-right text-slate-500">{c.registrations.target}</td>
                  <td className="px-5 py-4 text-right font-semibold">{pctLabel(c.registrations.current, c.registrations.target)}</td>
                  <td className="px-5 py-4 w-44"><ProgressBar value={pct(c.registrations.current, c.registrations.target)} /></td>
                  <td className="px-5 py-4 text-right font-medium">{toGo(c.registrations.current, c.registrations.target)}</td>
                  <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${toneClasses(s.tone)}`}>{s.label}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
