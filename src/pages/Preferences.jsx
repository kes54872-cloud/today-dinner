import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageContainer } from '../components/layout'
import { PreferenceSelector } from '../components/PreferenceSelector'
import { EmptyState, Icon } from '../components/ui'
import { cx } from '../lib/format'
import { PREFERENCE_ITEMS } from '../data/mock'
import { useApp } from '../store/AppStore'

const DISLIKE_REASONS = [
  '전체적으로 싫어요',
  '식감이 싫어요',
  '향이 싫어요',
  '크게 들어간 게 싫어요',
]

export function Preferences() {
  return (
    <PageContainer width="narrow">
      <h1 className="text-2xl font-extrabold text-ink md:text-3xl">나는 이렇게 먹어요.</h1>
      <p className="mt-1.5 text-sm text-muted">
        같은 재료도 먹는 방법에 따라 다르게 설정할 수 있어요.
      </p>

      <p className="mt-6 rounded-xl bg-primary-soft/60 px-4 py-3 text-xs leading-relaxed text-ink/80">
        예를 들어 <b>버섯</b>이 싫어도 <b>파스타 속 버섯</b>은 좋을 수 있죠. 재료 하나를
        통째로 빼는 대신, 상황별로 알려주면 더 잘 맞는 메뉴를 찾아드려요.
      </p>

      <ul className="mt-5 space-y-2.5">
        {PREFERENCE_ITEMS.map((it) => (
          <li key={it.id}>
            <Link
              to={`/my/preferences/${it.id}`}
              className="flex items-center gap-3.5 rounded-2xl border border-line bg-card p-4 hover:border-primary/40"
            >
              <span className="text-2xl" aria-hidden="true">
                {it.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-ink">{it.name}</span>
                <span className="block truncate text-xs text-muted">{it.summary}</span>
              </span>
              <Icon name="chevronRight" size={18} className="text-muted" />
            </Link>
          </li>
        ))}
      </ul>

      <Link
        to="/my"
        className="mt-6 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <Icon name="back" size={16} /> MY 로 돌아가기
      </Link>
    </PageContainer>
  )
}

export function IngredientPreference() {
  const { id } = useParams()
  const { getPref, setPref, toast } = useApp()
  const item = PREFERENCE_ITEMS.find((i) => i.id === id)
  const [reasons, setReasons] = useState(() => new Set(item?.dislikeReasons ?? []))

  if (!item) {
    return (
      <PageContainer width="narrow">
        <EmptyState icon="🤔" title="재료를 찾을 수 없어요" />
      </PageContainer>
    )
  }

  const toggleReason = (r) =>
    setReasons((s) => {
      const n = new Set(s)
      if (n.has(r)) n.delete(r)
      else n.add(r)
      return n
    })

  return (
    <PageContainer width="narrow">
      <Link
        to="/my/preferences"
        className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <Icon name="back" size={16} /> 취향 관리
      </Link>

      <div className="flex items-center gap-3">
        <span className="text-3xl" aria-hidden="true">
          {item.emoji}
        </span>
        <h1 className="text-2xl font-extrabold text-ink">{item.name}</h1>
      </div>

      {/* 싫은 이유 */}
      <section className="mt-6">
        <h2 className="mb-2.5 text-sm font-bold text-ink">
          어떤 {item.name}이(가) 별로인가요? <span className="font-normal text-muted">(복수 선택)</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {DISLIKE_REASONS.map((r) => {
            const on = reasons.has(r)
            return (
              <button
                key={r}
                onClick={() => toggleReason(r)}
                aria-pressed={on}
                className={cx(
                  'rounded-full border px-3.5 py-2 text-sm font-medium transition-colors',
                  on ? 'border-primary bg-primary text-white' : 'border-line bg-card text-ink hover:border-line-strong',
                )}
              >
                {r}
              </button>
            )
          })}
        </div>
      </section>

      {/* 먹는 방식별 선호도 */}
      <section className="mt-7">
        <h2 className="mb-1 text-sm font-bold text-ink">먹는 방식별 선호도</h2>
        <p className="mb-3 text-xs text-muted">
          😖 절대 싫어요 · 🙅 피하고 싶어요 · 😐 상황에 따라 · 🙂 괜찮아요 · ❤️ 좋아해요
        </p>
        <div className="space-y-2.5">
          {item.contexts.map((c) => (
            <PreferenceSelector
              key={c.key}
              label={c.label}
              value={getPref(item.id, c.key)}
              onChange={(v) => setPref(item.id, c.key, v)}
            />
          ))}
        </div>
      </section>

      <button
        onClick={() => toast('취향을 저장했어요')}
        className="mt-7 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-white hover:bg-primary-hover"
      >
        저장
      </button>
      <p className="mt-3 text-center text-xs text-muted">
        "{item.name} = 싫음"으로 모든 메뉴를 빼지 않아요. 위 설정에 맞춰 조절해요.
      </p>
    </PageContainer>
  )
}
