import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../store/AppStore'
import { won, minutes, cx } from '../lib/format'
import { FoodImage, Icon, MatchBadge, Stars } from './ui'

/* ── 좋아요(찜) 버튼 — 작은 scale 애니메이션 ───────────*/
export function LikeButton({ id, name, floating, className = '' }) {
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
        'grid place-items-center rounded-full transition-colors',
        floating
          ? 'h-10 w-10 bg-card/90 shadow-[var(--shadow-card)] backdrop-blur hover:bg-card'
          : 'h-9 w-9 hover:bg-line/60',
        className,
      )}
    >
      <span className={cx(burst && 'animate-pop', on ? 'text-primary' : 'text-muted')}>
        <Icon name="heart" size={floating ? 20 : 19} strokeWidth={on ? 0 : 1.8} className={on ? 'fill-primary' : ''} />
      </span>
    </button>
  )
}

/* ── 음식 카드 (그리드용) ──────────────────────────────*/
export function MenuCard({ menu }) {
  const fu = menu.fridgeUse?.length ?? 0
  return (
    <Link
      to={`/menu/${menu.id}`}
      className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-card shadow-[var(--shadow-card)] transition-transform duration-150 hover:-translate-y-1 active:translate-y-0 active:scale-[0.99]"
    >
      <div className="relative">
        <FoodImage
          emoji={menu.emoji}
          hue={menu.hue}
          photo={menu.photo}
          alt={menu.name}
          rounded="rounded-none"
          className="aspect-[4/3] w-full transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute right-2.5 top-2.5">
          <LikeButton id={menu.id} name={menu.name} floating />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-bold leading-snug text-ink">{menu.name}</h3>
        </div>
        <MatchBadge value={menu.match} />
        <p className="num text-[13px] text-muted">
          {minutes(menu.time)} · <Stars level={menu.difficulty} /> · {won(menu.cost)}
        </p>
        {fu > 0 && (
          <p className="mt-auto inline-flex items-center gap-1 rounded-lg bg-ok-soft px-2 py-1 text-xs font-medium text-ok">
            🧊 냉장고 재료 <span className="num">{fu}개</span>
          </p>
        )}
      </div>
    </Link>
  )
}

/* ── 오늘의 추천 (Home 대표 카드) ──────────────────────*/
export function RecommendationCard({ menu }) {
  const fu = menu.fridgeUse?.length ?? 0
  return (
    <Link
      to={`/menu/${menu.id}`}
      className="group block overflow-hidden rounded-[var(--radius-card)] border border-line bg-card shadow-[var(--shadow-card)] transition-transform duration-150 hover:-translate-y-1 sm:flex"
    >
      <div className="relative sm:w-[58%]">
        <p className="absolute left-4 top-4 z-10 rounded-full bg-ink/80 px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-white">
          TODAY&apos;S PICK
        </p>
        <div className="absolute right-3 top-3 z-10">
          <LikeButton id={menu.id} name={menu.name} floating />
        </div>
        <FoodImage
          emoji={menu.emoji}
          hue={menu.hue}
          photo={menu.photo}
          alt={menu.name}
          rounded="rounded-none"
          className="aspect-[4/3] w-full sm:aspect-auto sm:h-full"
        />
      </div>
      <div className="flex flex-col gap-3 p-5 sm:w-[42%] sm:justify-center sm:p-6">
        <h2 className="text-2xl font-extrabold leading-tight text-ink">{menu.name}</h2>
        <MatchBadge value={menu.match} size="lg" />
        <p className="num text-sm text-muted">
          {minutes(menu.time)} · 난이도 <Stars level={menu.difficulty} /> · 약 {won(menu.cost)}
        </p>
        {fu > 0 && (
          <p className="text-sm text-ink">
            냉장고에 있는 재료 <span className="num text-primary">{fu}개</span>를 쓸 수 있어요.
          </p>
        )}
        <span className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors group-hover:bg-primary-hover">
          레시피 보기 <Icon name="arrowRight" size={18} />
        </span>
      </div>
    </Link>
  )
}

/* ── 추천 이유 ─────────────────────────────────────────*/
export function RecommendationReason({ reasons, className = '' }) {
  return (
    <div className={cx('rounded-2xl border border-line bg-bg/60 p-4', className)}>
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
  return (
    <div className="flex gap-3 overflow-hidden rounded-[var(--radius-card)] border border-line bg-card p-3 shadow-[var(--shadow-card)]">
      <FoodImage
        emoji={item.emoji}
        hue={item.hue}
        alt={item.name}
        className="h-24 w-24 shrink-0"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-[15px] font-bold text-ink">{item.name}</h3>
          <button
            onClick={() => toggleSave(item.id, item.name)}
            aria-pressed={isSaved(item.id)}
            aria-label={isSaved(item.id) ? `${item.name} 찜 해제` : `${item.name} 찜하기`}
            className={cx('shrink-0', isSaved(item.id) ? 'text-primary' : 'text-muted')}
          >
            <Icon name="heart" size={19} strokeWidth={isSaved(item.id) ? 0 : 1.8} className={isSaved(item.id) ? 'fill-primary' : ''} />
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <MatchBadge value={item.match} />
          <span className="rounded-full border border-line px-2 py-0.5 text-xs text-muted">{item.kind}</span>
        </div>
        <p className="num text-[13px] text-muted">
          {won(item.cost)} · {item.info}
        </p>
        <p className="truncate text-xs text-muted">💡 {item.reason}</p>
      </div>
    </div>
  )
}
