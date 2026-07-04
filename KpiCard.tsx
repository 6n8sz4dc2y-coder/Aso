import { ProgressBar } from './ProgressBar'

export function KpiCard({ title, value, subtitle, progress }: { title: string, value: string, subtitle: string, progress?: number }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-200/70">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
        <p className="pb-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      {typeof progress === 'number' && <div className="mt-4"><ProgressBar value={progress} /></div>}
    </div>
  )
}
