import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageContainer } from '../components/layout'
import {
  MenuCard,
  RecommendationCard,
  RecommendationReason,
} from '../components/cards'
import { SectionHead, SkeletonCard, Icon } from '../components/ui'
import { MENUS, INGREDIENT_CATALOG } from '../data/mock'
import { defaultQty, explainReasons } from '../lib/format'
import { useApp } from '../store/AppStore'

const MODES = [
  { key: 'cook', title: '해먹을래', sub: '직접 요리' },
  { key: 'order', title: '시켜먹을래', sub: '배달 · 포장 · 외식' },
  { key: 'clear', title: '냉장고 털래', sub: '있는 재료 활용' },
  { key: 'guest', title: '손님이 와', sub: '여럿이 먹기' },
]

function QuickAsk() {
  const { fridge, addIngredient, removeIngredient, toast } = useApp()
  // 냉장고에 아직 없는 흔한 재료 중 하나를 물어봄
  const candidates = [
    'tofu',
    'chicken',
    'cheese',
    'tomato',
    'mushroom',
    'dumpling',
  ]
  const askId = candidates.find((id) => !fridge.some((f) => f.id === id))
  const item = INGREDIENT_CATALOG.find((i) => i.id === askId)
  const [answered, setAnswered] = useState(false)
  if (!item || answered) return null

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-card p-4">
      <p className="text-sm font-medium text-ink">
        냉장고에 {item.name} 있나요?
      </p>
      <div className="ml-auto flex gap-2">
        <button
          onClick={() => {
            addIngredient({
              ...item,
              count: defaultQty(item.unit),
              amount: null,
            })
            setAnswered(true)
          }}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          있어요
        </button>
        <button
          onClick={() => {
            removeIngredient(item.id)
            setAnswered(true)
            toast('알려줘서 고마워요')
          }}
          className="rounded-full border border-line-strong px-4 py-2 text-sm font-semibold text-ink hover:border-ink/40"
        >
          없어요
        </button>
      </div>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const { fridge } = useApp()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 550)
    return () => clearTimeout(t)
  }, [])

  const pick = MENUS[0]
  const more = MENUS.slice(1, 5)

  return (
    <PageContainer>
      {/* Hero */}
      <section className="animate-rise pb-6 pt-2 md:pt-6">
        <h1 className="text-[28px] font-extrabold leading-tight text-ink md:text-[40px]">
          오늘 저녁은
          <br />
          뭐가 먹고 싶어요?
        </h1>
        <p className="mt-2 text-sm text-muted md:text-base">
          지금의 상황을 골라주세요.
        </p>
      </section>

      {/* Mode selector */}
      <section
        className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
        aria-label="상황 선택"
      >
        {MODES.map((m, i) => (
          <button
            key={m.key}
            onClick={() => navigate(`/recommend/${m.key}`)}
            style={{ animationDelay: `${i * 45}ms` }}
            className="animate-rise group flex flex-col items-start rounded-[var(--radius-card)] border border-line bg-card p-4 text-left shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1 hover:border-primary/40 active:scale-[0.98] md:p-5"
          >
            <span className="flex w-full items-center justify-between">
              <span className="text-base font-bold text-ink md:text-lg">
                {m.title}
              </span>
              <Icon
                name="arrowRight"
                size={18}
                className="text-line-strong transition-colors group-hover:text-primary"
              />
            </span>
            <span className="mt-1 text-xs text-muted md:text-sm">{m.sub}</span>
          </button>
        ))}
      </section>

      {/* 오늘의 추천 */}
      <section className="mt-9">
        <SectionHead
          title="오늘의 추천"
          caption="냉장고와 취향을 반영한 한 그릇"
        />
        {loading ? (
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-card">
            <div className="skeleton aspect-[16/9] w-full" />
            <div className="space-y-3 p-5">
              <div className="skeleton h-6 w-1/2 rounded" />
              <div className="skeleton h-4 w-1/3 rounded" />
              <div className="skeleton h-10 w-32 rounded-full" />
            </div>
          </div>
        ) : (
          <div className="animate-fade-in space-y-4">
            <RecommendationCard menu={pick} />
            <RecommendationReason reasons={explainReasons(pick, fridge)} />
          </div>
        )}
      </section>

      {/* 빠른 질문 */}
      <section className="mt-6">
        <QuickAsk />
      </section>

      {/* 더 보기 */}
      <section className="mt-9">
        <SectionHead
          title="이런 메뉴는 어때요?"
          right={
            <Link
              to="/recommend/cook"
              className="text-sm font-semibold text-primary"
            >
              더 보기
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : more.map((m) => <MenuCard key={m.id} menu={m} />)}
        </div>
      </section>

      {/* 냉장고 바로가기 */}
      <Link
        to="/fridge"
        className="mt-9 flex items-center gap-3 rounded-[var(--radius-card)] border border-line bg-card p-4 text-sm shadow-[var(--shadow-card)] hover:border-primary/40"
      >
        <span className="font-medium text-ink">
          냉장고를 정리하고 더 정확한 추천 받기
        </span>
        <Icon
          name="chevronRight"
          size={18}
          className="ml-auto shrink-0 text-muted"
        />
      </Link>
    </PageContainer>
  )
}
