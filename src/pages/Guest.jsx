import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '../components/layout'
import { Button, Icon } from '../components/ui'
import { won, minutes, cx } from '../lib/format'
import { GUEST_SETS } from '../data/mock'
import { useApp } from '../store/AppStore'

const GROUPS = [
  { key: 'people', label: '인원', options: ['2', '3', '4', '5+'] },
  { key: 'mood', label: '분위기', options: ['편하게', '친구 모임', '특별한 날', '브런치'] },
  { key: 'time', label: '준비 시간', options: ['30분', '1시간', '2시간+'] },
  { key: 'level', label: '난이도', options: ['간단하게', '적당히', '제대로'] },
]

function OptionRow({ label, options, value, onChange }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-ink">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={cx(
              'min-w-[64px] rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors',
              value === o
                ? 'border-primary bg-primary text-white'
                : 'border-line bg-card text-ink hover:border-line-strong',
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Guest() {
  const { toast } = useApp()
  const [sel, setSel] = useState({ people: '3', mood: '편하게', time: '1시간', level: '적당히' })
  const [result, setResult] = useState(null)

  const find = () => {
    const set = GUEST_SETS.find((g) => g.forMood === sel.mood) ?? GUEST_SETS[0]
    setResult(set)
  }

  return (
    <PageContainer width="narrow">
      <Link to="/" className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <Icon name="back" size={16} /> 홈
      </Link>
      <h1 className="text-2xl font-extrabold text-ink md:text-3xl">
        🎉 오늘 누가 놀러 오나요?
      </h1>
      <p className="mt-1.5 text-sm text-muted">상황을 알려주면 한 끼 식사 세트로 짜드려요.</p>

      <div className="mt-6 space-y-5 rounded-[var(--radius-card)] border border-line bg-card p-5 shadow-[var(--shadow-card)]">
        {GROUPS.map((g) => (
          <OptionRow
            key={g.key}
            label={g.label}
            options={g.options}
            value={sel[g.key]}
            onChange={(v) => setSel((s) => ({ ...s, [g.key]: v }))}
          />
        ))}
        <Button className="w-full" size="lg" onClick={find}>
          손님상 추천받기
        </Button>
      </div>

      {result && (
        <section className="animate-rise mt-6 overflow-hidden rounded-[var(--radius-card)] border border-line bg-card shadow-[var(--shadow-card)]">
          <div className="border-b border-line bg-primary-soft/50 px-5 py-4">
            <p className="text-xs font-bold tracking-[0.14em] text-primary">오늘의 손님 메뉴</p>
            <h2 className="mt-1 text-xl font-extrabold text-ink">{result.title}</h2>
            <p className="num mt-1 text-sm text-muted">
              {sel.people}명 · {result.difficulty}
            </p>
          </div>
          <ul className="divide-y divide-line">
            {result.items.map((it) => (
              <li key={it.role + it.name} className="flex items-center gap-4 px-5 py-3.5">
                <span className="w-16 shrink-0 text-xs font-bold tracking-wide text-muted">
                  {it.role}
                </span>
                <span className="text-sm font-semibold text-ink">{it.name}</span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 divide-x divide-line border-t border-line">
            <div className="px-5 py-4 text-center">
              <p className="text-xs text-muted">총 준비시간</p>
              <p className="num mt-0.5 text-lg font-extrabold text-ink">{minutes(result.time)}</p>
            </div>
            <div className="px-5 py-4 text-center">
              <p className="text-xs text-muted">예상 비용</p>
              <p className="num mt-0.5 text-lg font-extrabold text-ink">{won(result.cost)}</p>
            </div>
          </div>
          <div className="p-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => toast('장보기 목록에 세트 재료를 담았어요')}
            >
              <Icon name="cart" size={17} /> 세트 재료 장보기에 담기
            </Button>
          </div>
        </section>
      )}
    </PageContainer>
  )
}
