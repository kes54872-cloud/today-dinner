import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '../components/layout'
import { Icon, ProgressBar } from '../components/ui'
import { cx } from '../lib/format'
import { SHOPPING } from '../data/mock'
import { useApp } from '../store/AppStore'

export default function Shopping() {
  const { toast } = useApp()
  const [checked, setChecked] = useState(() => new Set())

  const toggle = (name) =>
    setChecked((s) => {
      const n = new Set(s)
      if (n.has(name)) n.delete(name)
      else n.add(name)
      return n
    })

  const done = SHOPPING.buy.filter((b) => checked.has(b)).length
  const pct = Math.round((done / SHOPPING.buy.length) * 100)

  return (
    <PageContainer width="narrow">
      <Link to="/planner" className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <Icon name="back" size={16} /> 주간 식단
      </Link>
      <h1 className="text-2xl font-extrabold text-ink md:text-3xl">이번 주 장보기</h1>
      <p className="mt-1.5 text-sm text-muted">
        주간 식단과 냉장고를 비교해 필요한 재료만 골라봤어요.
      </p>

      <div className="mt-5 rounded-2xl border border-line bg-card p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-ink">구매 진행</span>
          <span className="num text-muted">
            {done} / {SHOPPING.buy.length}
          </span>
        </div>
        <ProgressBar value={pct} label="장보기 진행률" className="mt-2" />
      </div>

      {/* 구매 필요 */}
      <section className="mt-7">
        <h2 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-ink">
          <span aria-hidden="true">🛒</span> 구매 필요
        </h2>
        <ul className="divide-y divide-line rounded-2xl border border-line bg-card">
          {SHOPPING.buy.map((b) => {
            const on = checked.has(b)
            return (
              <li key={b}>
                <button
                  onClick={() => toggle(b)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                  aria-pressed={on}
                >
                  <span
                    className={cx(
                      'grid h-5 w-5 place-items-center rounded-md border transition-colors',
                      on ? 'border-primary bg-primary text-white' : 'border-line-strong',
                    )}
                  >
                    {on && <Icon name="check" size={13} strokeWidth={2.6} />}
                  </span>
                  <span className={cx('text-sm', on ? 'text-muted line-through' : 'text-ink')}>
                    {b}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      {/* 이미 보유 */}
      <section className="mt-6">
        <h2 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-ink">
          <span aria-hidden="true">✓</span> 이미 가지고 있어요
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {SHOPPING.have.map((h) => (
            <span
              key={h}
              className="inline-flex items-center gap-1 rounded-full bg-ok-soft px-2.5 py-1 text-xs font-medium text-ok"
            >
              <Icon name="check" size={12} strokeWidth={2.6} /> {h}
            </span>
          ))}
        </div>
      </section>

      <button
        onClick={() => toast('장보기 목록을 복사했어요 📋')}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-white hover:bg-primary-hover"
      >
        <Icon name="bag" size={17} /> 목록 복사하기
      </button>
    </PageContainer>
  )
}
