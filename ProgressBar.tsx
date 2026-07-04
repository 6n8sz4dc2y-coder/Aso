export function ProgressBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, Math.round(value * 100)))
  const colour = clamped >= 100 ? 'bg-emerald-500' : clamped >= 90 ? 'bg-amber-500' : 'bg-rose-500'
  return (
    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
      <div className={`h-full rounded-full ${colour}`} style={{ width: `${clamped}%` }} />
    </div>
  )
}
