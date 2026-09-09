import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '../components/layout'
import { Button, EmptyState, Icon, ProgressBar } from '../components/ui'
import { minutes, cx, menuUsesIngredient } from '../lib/format'
import { MENUS } from '../data/mock'
import { useApp } from '../store/AppStore'
export default function FridgeClear() {
  const { fridge } = useApp()
  const total = fridge.length
  // 냉장고 재료를 많이 쓰는 순으로
  const ranked = useMemo(() => {
    return MENUS.map((m) => {
      const usedCount = fridge.filter((f) =>
        menuUsesIngredient(m, f.name),
      ).length
      return { ...m, usedCount, buyCount: m.buyExtra.length }
    })
      .filter((m) => m.usedCount > 0)
      .sort((a, b) => b.usedCount - a.usedCount || a.buyCount - b.buyCount)
  }, [fridge])
  const [selId, setSelId] = useState(ranked[0]?.id)
  const sel = ranked.find((m) => m.id === selId) ?? ranked[0]
  const usePct = sel && total ? Math.round((sel.usedCount / total) * 100) : 0
  if (total === 0) {
    return (
      <PageContainer width="narrow">
        <BackLink />
        <EmptyState
          title="냉장고가 비어 있어요"
          description="재료를 추가하면 얼마나 활용할 수 있는지 보여드릴게요."
          action={
            <Button as={Link} to="/fridge">
              재료 추가하기
            </Button>
          }
        />
      </PageContainer>
    )
  }
  return (
    <PageContainer width="narrow">
      <BackLink />
      <h1 className="text-2xl font-extrabold text-ink md:text-3xl">
        냉장고를 비워볼까요?
      </h1>
      {/* 활용도 시각화 */}
      <div className="mt-5 rounded-[var(--radius-card)] border border-line bg-card p-5 shadow-[var(--shadow-card)]">
        <p className="num text-sm text-muted">
          현재 재료 <span className="text-ink">{total}개</span>
        </p>
        {sel && (
          <>
            <p className="mt-1 text-sm text-ink">
              <span className="font-semibold">{sel.name}</span> 을(를) 만들면{' '}
              <span className="num text-primary">{sel.usedCount}개</span>를
              사용해요
            </p>
            <div className="mt-4 flex items-end gap-3">
              <span className="num text-4xl font-extrabold text-primary">
                {usePct}%
              </span>
              <span className="pb-1 text-sm text-muted">활용 가능</span>
            </div>
            <ProgressBar
              value={usePct}
              label="냉장고 활용도"
              className="mt-2"
            />
          </>
        )}
      </div>
      {/* 메뉴 목록 */}
      <h2 className="mb-3 mt-8 text-lg font-bold text-ink">
        가장 많이 활용할 수 있는 메뉴
      </h2>
      <ul className="space-y-2.5">
        {ranked.map((m) => (
          <li key={m.id}>
            <button
              onClick={() => setSelId(m.id)}
              className={cx(
                'flex w-full items-center gap-3 rounded-2xl border bg-card p-3.5 text-left transition-colors',
                selId === m.id
                  ? 'border-primary ring-1 ring-primary/30'
                  : 'border-line hover:border-line-strong',
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-ink">{m.name}</p>
                <p className="num mt-0.5 text-xs text-muted">
                  {minutes(m.time)}
                </p>
                <p className="mt-1 flex flex-wrap gap-1.5 text-xs">
                  <span className="rounded-md bg-ok-soft px-1.5 py-0.5 font-medium text-ok">
                    사용 재료 {m.usedCount}개
                  </span>
                  {m.buyCount > 0 && (
                    <span className="rounded-md border border-line px-1.5 py-0.5 text-muted">
                      추가 구매 {m.buyCount}개
                    </span>
                  )}
                </p>
              </div>
              <Link
                to={`/menu/${m.id}`}
                aria-label={`${m.name} 레시피`}
                onClick={(e) => e.stopPropagation()}
                className="shrink-0 text-muted hover:text-ink"
              >
                <Icon name="chevronRight" size={18} />
              </Link>
            </button>
          </li>
        ))}
      </ul>
    </PageContainer>
  )
}
function BackLink() {
  return (
    <Link
      to="/fridge"
      className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
    >
      <Icon name="back" size={16} /> 냉장고
    </Link>
  )
}
