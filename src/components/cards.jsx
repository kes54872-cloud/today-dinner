import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../store/AppStore'
import { minutes, cx, fridgeMatchCount } from '../lib/format'
import { Icon, MatchBadge, Stars } from './ui'

/* ── 좋아요(찜) 버튼 — 작은 scale 애니메이션 ───────────*/
export function LikeButton({ id, name, className = '' }) {
  const { isSaved, toggleSave } = useApp()
  const [burst, setBurst] = useState(false)
  const on = isSaved(id)

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleSave(id, name)
        setBurst(true)
        setTimeout(() => setBurst(false), 280)
      }}
      aria-pressed={on}
      aria-label={on ? `${name} 찜 해제` : `${name} 찜하기`}
      className={cx(
        'grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors hover:bg-line/60',
        className,
      )}
    >
      <span
        className={cx(
          burst && 'animate-pop',
          on ? 'text-primary' : 'text-muted',
        )}
      >
        <Icon
          name="heart"
          size={19}
          strokeWidth={on ? 0 : 1.8}
          className={on ? 'fill-primary' : ''}
        />
      </span>
    </button>
  )
}

/* ── 음식 카드 (그리드용) ──────────────────────────────*/
export function MenuCard({ menu }) {
  const { fridge } = useApp()
  const fu = fridgeMatchCount(menu, fridge)
  return (
    <Link
      to={`/menu/${menu.id}`}
      className="group flex flex-col gap-2 rounded-[var(--radius-card)] border border-line bg-card p-4 shadow-[var(--shadow-card)] transition-transform duration-150 hover:-translate-y-1 hover:border-primary/40 active:translate-y-0 active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[15px] font-bold leading-snug text-ink">
          {menu.name}
        </h3>
        <LikeButton id={menu.id} name={menu.name} className="-mr-1.5 -mt-1" />
      </div>
      <MatchBadge value={menu.match} />
      <p className="num text-[13px] text-muted">
        {minutes(menu.time)} · 난이도 <Stars level={menu.difficulty} />
      </p>
      {fu > 0 && (
        <p className="mt-auto inline-flex w-fit items-center gap-1 rounded-lg bg-ok-soft px-2 py-1 text-xs font-medium text-ok">
          냉장고 재료 <span className="num">{fu}개</span>
        </p>
      )}
    </Link>
  )
}

/* ── 오늘의 추천 (Home 대표 카드) ──────────────────────*/
export function RecommendationCard({ menu }) {
  const { fridge } = useApp()
  const fu = fridgeMatchCount(menu, fridge)
  return (
    <Link
      to={`/menu/${menu.id}`}
      className="group block rounded-[var(--radius-card)] border border-primary/20 bg-primary-soft/35 p-5 shadow-[var(--shadow-card)] transition-transform duration-150 hover:-translate-y-1 md:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-ink/85 px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-white">
          TODAY&apos;S PICK
        </span>
        <LikeButton
          id={menu.id}
          name={menu.name}
          className="-mr-1.5 -mt-1 bg-card/70"
        />
      </div>
      <h2 className="mt-3 text-2xl font-extrabold leading-tight text-ink md:text-[28px]">
        {menu.name}
      </h2>
      <div className="mt-2.5">
        <MatchBadge value={menu.match} size="lg" />
      </div>
      <p className="num mt-2.5 text-sm text-muted">
        {minutes(menu.time)} · 난이도 <Stars level={menu.difficulty} />
      </p>
      {fu > 0 && (
        <p className="mt-2 text-sm text-ink">
          냉장고에 있는 재료 <span className="num text-primary">{fu}개</span>를
          쓸 수 있어요.
        </p>
      )}
      <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors group-hover:bg-primary-hover">
        레시피 보기 <Icon name="arrowRight" size={18} />
      </span>
    </Link>
  )
}

/* ── 추천 이유 ─────────────────────────────────────────*/
export function RecommendationReason({ reasons, className = '' }) {
  if (!reasons?.length) return null
  return (
    <div
      className={cx('rounded-2xl border border-line bg-bg/60 p-4', className)}
    >
      <p className="mb-2.5 text-sm font-bold text-ink">왜 이 메뉴일까요?</p>
      <ul className="space-y-2">
        {reasons.map((r) => (
          <li key={r} className="flex items-start gap-2 text-sm text-ink/90">
            <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-ok text-white">
              <Icon name="check" size={12} strokeWidth={2.4} />
            </span>
            {r}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── 배달/외식 카드 ────────────────────────────────────*/
export function DeliveryCard({ item }) {
  const { isSaved, toggleSave } = useApp()
  const on = isSaved(item.id)
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[15px] font-bold text-ink">{item.name}</h3>
        <button
          onClick={() => toggleSave(item.id, item.name)}
          aria-pressed={on}
          aria-label={on ? `${item.name} 찜 해제` : `${item.name} 찜하기`}
          className={cx(
            '-mr-1 -mt-0.5 shrink-0',
            on ? 'text-primary' : 'text-muted',
          )}
        >
          <Icon
            name="heart"
            size={19}
            strokeWidth={on ? 0 : 1.8}
            className={on ? 'fill-primary' : ''}
          />
        </button>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <MatchBadge value={item.match} />
        <span className="rounded-full border border-line px-2 py-0.5 text-xs text-muted">
          {item.kind}
        </span>
        <span className="rounded-full border border-line px-2 py-0.5 text-xs text-muted">
          {item.genre}
        </span>
      </div>
      <p className="num mt-2 text-[13px] text-muted">{item.info}</p>
      <p className="mt-1 text-xs text-muted">{item.reason}</p>
    </div>
  )
}
