import { cx, starText } from '../lib/format'

/* ── Line Icon 세트 ─────────────────────────────────────
   모두 24x24, stroke 기반. aria-hidden 기본. */
const PATHS = {
  home: 'M3 10.5 12 4l9 6.5M5 9.5V20h14V9.5',
  fridge:
    'M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM5 10h14M9 6v1M9 13v2',
  calendar:
    'M4 6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6ZM4 9.5h16M8 3v4M16 3v4',
  heart:
    'M12 20s-7-4.35-9.33-8.24C1.44 9.61 2.2 6.6 5 5.6c2-.72 4 .2 5 2 1-1.8 3-2.72 5-2 2.8 1 3.56 4.01 2.33 6.16C19 15.65 12 20 12 20Z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 20c1.2-3.5 4-5 7-5s5.8 1.5 7 5',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  close: 'M6 6l12 12M18 6 6 18',
  check: 'M5 13l4 4L19 7',
  back: 'M15 5l-7 7 7 7',
  chevronRight: 'M9 5l7 7-7 7',
  chevronDown: 'M6 9l6 6 6-6',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3.5 2',
  spark:
    'M12 3v4M12 17v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M3 12h4M17 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8',
  sliders: 'M4 8h10M18 8h2M4 16h4M12 16h8M14 6v4M8 14v4',
  chef: 'M7 15v4h10v-4M7 15a4 4 0 0 1-1-7.87A4 4 0 0 1 13.5 5 4 4 0 0 1 18 7.13 4 4 0 0 1 17 15H7Z',
  filter: 'M4 6h16M7 12h10M10 18h4',
  trash:
    'M5 7h14M10 7V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13',
  arrowRight: 'M5 12h14M13 6l6 6-6 6',
  arrowDown: 'M12 5v14M6 13l6 6 6-6',
  bag: 'M6 8h12l1 12H5L6 8ZM9 8V6a3 3 0 0 1 6 0v2',
  bell: 'M6 16V11a6 6 0 1 1 12 0v5l2 2H4l2-2ZM10 20a2 2 0 0 0 4 0',
  cart: 'M4 5h2l2.4 11.2A2 2 0 0 0 10.35 18H17a2 2 0 0 0 1.95-1.55L21 8H7M10 21h.01M17 21h.01',
  refresh:
    'M4 9a8 8 0 0 1 14-3l2 2M20 15a8 8 0 0 1-14 3l-2-2M18 4v4h-4M6 20v-4h4',
}

export function Icon({ name, size = 22, className = '', strokeWidth = 1.7 }) {
  const d = PATHS[name]
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {d && <path d={d} />}
    </svg>
  )
}

/* ── Chip / 필터 칩 ─────────────────────────────────────*/
export function Chip({
  active,
  children,
  onClick,
  as = 'button',
  className = '',
  ...rest
}) {
  const Comp = as
  return (
    <Comp
      onClick={onClick}
      aria-pressed={as === 'button' ? !!active : undefined}
      className={cx(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-white'
          : 'border-line bg-card text-ink hover:border-line-strong',
        className,
      )}
      {...rest}
    >
      {children}
    </Comp>
  )
}

/* ── 난이도 별 (1~3단계, 3 초과는 3으로 표시) ───────────*/
export function Stars({ level, className = '' }) {
  const filled = Math.max(0, Math.min(3, level))
  const beyond = level > 3
  return (
    <span
      className={cx('num tracking-tight text-primary', className)}
      aria-label={`난이도 ${level}단계 (${starText(level)})`}
    >
      <span aria-hidden="true">{'★'.repeat(filled)}</span>
      <span aria-hidden="true" className="text-line-strong">
        {'★'.repeat(3 - filled)}
      </span>
      {beyond && (
        <span aria-hidden="true" className="ml-0.5 text-primary">
          +
        </span>
      )}
    </span>
  )
}

/* ── 취향 적합도 배지 ───────────────────────────────────*/
export function MatchBadge({ value, size = 'sm' }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full bg-primary-soft font-semibold text-primary',
        size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs',
      )}
    >
      <span className="num">{value}%</span>
      <span className="font-medium">취향 적합</span>
    </span>
  )
}

/* ── Progress bar ──────────────────────────────────────*/
export function ProgressBar({ value, label, className = '' }) {
  return (
    <div className={className}>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  )
}

/* ── Segmented control ─────────────────────────────────*/
export function SegmentedControl({ options, value, onChange, className = '' }) {
  return (
    <div
      className={cx(
        'inline-flex rounded-full border border-line bg-card p-1 text-sm',
        className,
      )}
      role="tablist"
    >
      {options.map((opt) => {
        const v = typeof opt === 'string' ? opt : opt.value
        const label = typeof opt === 'string' ? opt : opt.label
        return (
          <button
            key={v}
            role="tab"
            aria-selected={value === v}
            onClick={() => onChange(v)}
            className={cx(
              'rounded-full px-4 py-1.5 font-medium transition-colors',
              value === v
                ? 'bg-primary text-white'
                : 'text-muted hover:text-ink',
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

/* ── Empty state ───────────────────────────────────────*/
export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-line bg-card/60 px-6 py-14 text-center">
      <p className="text-base font-semibold text-ink">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-muted">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

/* ── Skeleton ──────────────────────────────────────────*/
export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-card">
      <div className="skeleton aspect-[4/3] w-full" />
      <div className="space-y-2.5 p-4">
        <div className="skeleton h-4 w-2/3 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-3 w-3/4 rounded" />
      </div>
    </div>
  )
}

/* ── 공통 버튼 ─────────────────────────────────────────*/
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  as = 'button',
  ...rest
}) {
  const Comp = as
  return (
    <Comp
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:opacity-50',
        size === 'lg'
          ? 'px-6 py-3.5 text-base'
          : size === 'sm'
            ? 'px-3.5 py-2 text-sm'
            : 'px-5 py-3 text-sm',
        variant === 'primary' && 'bg-primary text-white hover:bg-primary-hover',
        variant === 'outline' &&
          'border border-line-strong bg-card text-ink hover:border-ink/40',
        variant === 'ghost' && 'text-muted hover:bg-line/50 hover:text-ink',
        className,
      )}
      {...rest}
    >
      {children}
    </Comp>
  )
}

/* ── 섹션 헤더 ─────────────────────────────────────────*/
export function SectionHead({ title, caption, right }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        <h2 className="text-lg font-bold text-ink">{title}</h2>
        {caption && <p className="mt-0.5 text-sm text-muted">{caption}</p>}
      </div>
      {right}
    </div>
  )
}
