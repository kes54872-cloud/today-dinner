import { PREF_SCALE, cx, prefMeta } from '../lib/format'

/*
 * 5단계 편식 선호도 selector.
 * checkbox 처럼 "좋다/싫다" 이분법이 아니라 상황별로 다르게 고를 수 있게 합니다.
 */
export function PreferenceSelector({ label, value, onChange, hint }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-3.5">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-ink">{label}</span>
        <span className="text-xs text-muted">{prefMeta(value).label}</span>
      </div>
      <div
        role="radiogroup"
        aria-label={`${label} 선호도`}
        className="flex items-center justify-between gap-1"
      >
        {PREF_SCALE.map((p) => {
          const active = value === p.value
          return (
            <button
              key={p.value}
              role="radio"
              aria-checked={active}
              aria-label={p.label}
              onClick={() => onChange(p.value)}
              className={cx(
                'flex flex-1 flex-col items-center gap-1 rounded-xl border py-2 transition-all',
                active
                  ? 'scale-105 border-primary bg-primary-soft'
                  : 'border-transparent hover:bg-line/50 opacity-60 hover:opacity-100',
              )}
            >
              <span className="text-xl" aria-hidden="true">
                {p.emoji}
              </span>
              <span
                className={cx(
                  'h-1 w-1 rounded-full',
                  active ? 'bg-primary' : 'bg-transparent',
                )}
              />
            </button>
          )
        })}
      </div>
      {hint && <p className="mt-2 text-xs leading-relaxed text-muted">{hint}</p>}
    </div>
  )
}
