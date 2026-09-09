import { Link } from 'react-router-dom'
import { PageContainer } from '../components/layout'
import { Icon, SectionHead } from '../components/ui'
import { minutes, cx } from '../lib/format'
import { MODE_LABEL } from '../data/mock'
import { useApp } from '../store/AppStore'

const MODE_CYCLE = ['cook', 'order', 'guest']

export default function Planner() {
  const { week, setDay, toast } = useApp()

  const cycleMode = (i, cur) => {
    const next = MODE_CYCLE[(MODE_CYCLE.indexOf(cur) + 1) % MODE_CYCLE.length]
    setDay(i, { mode: next })
    toast(`${week[i].day}요일 · ${MODE_LABEL[next].text}`)
  }

  return (
    <PageContainer>
      <SectionHead
        title="주간 식단"
        caption="이번 주 저녁 계획이에요. 요일의 아이콘을 누르면 식사 방식이 바뀌어요."
        right={
          <Link
            to="/planner/shopping"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            <Icon name="cart" size={16} /> 이번 주 장보기
          </Link>
        }
      />

      {/* Desktop: 7일 그리드 */}
      <div className="hidden grid-cols-7 gap-3 lg:grid">
        {week.map((d, i) => (
          <div
            key={d.day}
            className="flex flex-col rounded-2xl border border-line bg-card p-3 shadow-[var(--shadow-card)]"
          >
            <span className="text-sm font-bold text-muted">{d.day}</span>
            <p className="mt-2 min-h-[40px] text-sm font-semibold leading-snug text-ink">
              {d.menu}
            </p>
            <button
              onClick={() => cycleMode(i, d.mode)}
              className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-bg px-2.5 py-1 text-xs font-medium text-ink hover:bg-line/70"
              aria-label={`${d.day}요일 식사 방식 바꾸기 (현재 ${MODE_LABEL[d.mode].text})`}
            >
              {MODE_LABEL[d.mode].text}
            </button>
            <p className="num mt-2 text-xs text-muted">{minutes(d.time)}</p>
            {d.key.length > 0 && (
              <p className="mt-1.5 flex flex-wrap gap-1">
                {d.key.map((k) => (
                  <span
                    key={k}
                    className="rounded bg-bg px-1.5 py-0.5 text-[11px] text-muted"
                  >
                    {k}
                  </span>
                ))}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Mobile / Tablet: 세로 날짜 카드 */}
      <ul className="space-y-3 lg:hidden">
        {week.map((d, i) => (
          <li
            key={d.day}
            className="flex gap-4 rounded-2xl border border-line bg-card p-4 shadow-[var(--shadow-card)]"
          >
            <div className="flex w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-bg py-2">
              <span className="text-base font-extrabold text-ink">{d.day}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-bold text-ink">{d.menu}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => cycleMode(i, d.mode)}
                  className="inline-flex items-center gap-1 rounded-full bg-bg px-2.5 py-1 text-xs font-medium text-ink"
                  aria-label={`${d.day}요일 식사 방식 바꾸기 (현재 ${MODE_LABEL[d.mode].text})`}
                >
                  {MODE_LABEL[d.mode].text}
                </button>
                <span className="num text-xs text-muted">
                  {minutes(d.time)}
                </span>
              </div>
              {d.key.length > 0 && (
                <p className="mt-2 flex flex-wrap gap-1">
                  {d.key.map((k) => (
                    <span
                      key={k}
                      className={cx(
                        'rounded bg-bg px-1.5 py-0.5 text-[11px] text-muted',
                      )}
                    >
                      {k}
                    </span>
                  ))}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </PageContainer>
  )
}
