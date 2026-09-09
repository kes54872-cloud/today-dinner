import { useMemo, useState } from 'react'
import { Navigate, useParams, Link } from 'react-router-dom'
import { PageContainer } from '../components/layout'
import { MenuCard } from '../components/cards'
import { Chip, EmptyState, Icon } from '../components/ui'
import { MENUS } from '../data/mock'
const FILTERS = [
  { key: 'quick', label: '20분 이내', test: (m) => m.time <= 20 },
  { key: 'easy', label: '쉬운 요리', test: (m) => m.difficulty <= 2 },
  {
    key: 'fridge',
    label: '냉장고 재료 우선',
    test: (m) => (m.fridgeUse?.length ?? 0) >= 3,
  },
  { key: 'new', label: '새로운 요리', test: (m) => m.category === 'new' },
]
const SECTIONS = [
  { key: 'safe', title: '안전한 선택', caption: '실패 없이 내가 좋아할 메뉴' },
  {
    key: 'new',
    title: '새로운 선택',
    caption: '평소 취향에서 조금 벗어난 메뉴',
  },
  {
    key: 'challenge',
    title: '한 단계 도전',
    caption: '지금 할 수 있는 요리보다 조금 어려운 메뉴',
  },
]
export default function Recommend() {
  const { mode } = useParams()
  const [active, setActive] = useState([])
  const filtered = useMemo(() => {
    const tests = FILTERS.filter((f) => active.includes(f.key)).map(
      (f) => f.test,
    )
    return MENUS.filter((m) => tests.every((t) => t(m)))
  }, [active])
  if (mode === 'order') return <Navigate to="/delivery" replace />
  if (mode === 'clear') return <Navigate to="/fridge/clear" replace />
  if (mode === 'guest') return <Navigate to="/guest" replace />
  const toggle = (k) =>
    setActive((a) => (a.includes(k) ? a.filter((x) => x !== k) : [...a, k]))
  const total = filtered.length
  return (
    <PageContainer>
      <div className="animate-rise">
        <Link
          to="/"
          className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
        >
          <Icon name="back" size={16} /> 홈
        </Link>
        <h1 className="text-2xl font-extrabold text-ink md:text-3xl">
          오늘은 직접 만들어볼까요?
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          취향·냉장고·요리 실력을 반영한 <span className="num">{total}</span>
          개의 메뉴예요.
        </p>
      </div>
      {/* 필터 chip */}
      <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1">
        {FILTERS.map((f) => (
          <Chip
            key={f.key}
            active={active.includes(f.key)}
            onClick={() => toggle(f.key)}
          >
            {f.label}
          </Chip>
        ))}
        {active.length > 0 && (
          <button
            onClick={() => setActive([])}
            className="whitespace-nowrap px-2 text-sm font-medium text-muted hover:text-ink"
          >
            초기화
          </button>
        )}
      </div>
      {total === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="조건에 맞는 메뉴가 없어요"
            description="필터를 하나만 풀어보면 딱 맞는 메뉴가 나올 거예요."
            action={
              <button
                onClick={() => setActive([])}
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white"
              >
                필터 초기화
              </button>
            }
          />
        </div>
      ) : (
        <div className="mt-7 space-y-10">
          {SECTIONS.map((s) => {
            const items = filtered.filter((m) => m.category === s.key)
            if (!items.length) return null
            return (
              <section key={s.key}>
                <div className="mb-3">
                  <h2 className="text-lg font-bold text-ink">{s.title}</h2>
                  <p className="mt-0.5 text-sm text-muted">{s.caption}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
                  {items.map((m) => (
                    <MenuCard key={m.id} menu={m} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </PageContainer>
  )
}
