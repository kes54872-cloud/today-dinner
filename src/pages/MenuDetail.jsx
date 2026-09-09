import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageContainer } from '../components/layout'
import { LikeButton, RecommendationReason } from '../components/cards'
import { Button, FoodImage, Icon, MatchBadge, Stars } from '../components/ui'
import { EmptyState } from '../components/ui'
import { won, minutes, difficultyLabel } from '../lib/format'
import { MENUS, DELIVERY } from '../data/mock'
import { useApp } from '../store/AppStore'

export default function MenuDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { fridge, toast } = useApp()
  const menu = MENUS.find((m) => m.id === id)
  const delivery = DELIVERY.find((m) => m.id === id)

  if (!menu && !delivery) {
    return (
      <PageContainer width="narrow">
        <EmptyState
          icon="🤔"
          title="메뉴를 찾을 수 없어요"
          description="삭제되었거나 주소가 잘못되었을 수 있어요."
          action={
            <Button as={Link} to="/">
              홈으로
            </Button>
          }
        />
      </PageContainer>
    )
  }

  if (delivery) {
    return (
      <PageContainer width="narrow">
        <BackBtn onClick={() => navigate(-1)} />
        <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-card shadow-[var(--shadow-card)]">
          <div className="relative">
            <FoodImage emoji={delivery.emoji} hue={delivery.hue} alt={delivery.name} rounded="rounded-none" className="aspect-[16/10] w-full" />
            <div className="absolute right-3 top-3">
              <LikeButton id={delivery.id} name={delivery.name} floating />
            </div>
          </div>
          <div className="space-y-3 p-5">
            <h1 className="text-2xl font-extrabold text-ink">{delivery.name}</h1>
            <div className="flex flex-wrap gap-2">
              <MatchBadge value={delivery.match} size="lg" />
              <span className="rounded-full border border-line px-3 py-1 text-sm text-muted">{delivery.kind}</span>
              <span className="rounded-full border border-line px-3 py-1 text-sm text-muted">{delivery.genre}</span>
            </div>
            <p className="num text-sm text-muted">{won(delivery.cost)} · {delivery.info}</p>
            <RecommendationReason reasons={[delivery.reason, '어제 먹은 메뉴와 겹치지 않아요', '지금 시간대에 자주 주문하던 종류예요']} />
            <Button className="w-full" size="lg" onClick={() => toast('실제 주문 연동은 준비 중이에요 🙏')}>
              주문하러 가기
            </Button>
          </div>
        </div>
      </PageContainer>
    )
  }

  const inFridge = (name) => fridge.some((f) => f.name === name || name.includes(f.name))

  return (
    <PageContainer width="narrow">
      <BackBtn onClick={() => navigate(-1)} />

      <article className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-card shadow-[var(--shadow-card)]">
        <div className="relative">
          <FoodImage
            emoji={menu.emoji}
            hue={menu.hue}
            photo={menu.photo}
            alt={menu.name}
            rounded="rounded-none"
            className="aspect-[16/10] w-full"
          />
          <div className="absolute right-3 top-3">
            <LikeButton id={menu.id} name={menu.name} floating />
          </div>
        </div>

        <div className="space-y-4 p-5 md:p-6">
          <div>
            <div className="flex flex-wrap gap-1.5">
              {menu.tags.map((t) => (
                <span key={t} className="rounded-full bg-bg px-2.5 py-1 text-xs text-muted">
                  #{t}
                </span>
              ))}
            </div>
            <h1 className="mt-2 text-[26px] font-extrabold leading-tight text-ink">{menu.name}</h1>
          </div>

          <MatchBadge value={menu.match} size="lg" />

          <dl className="grid grid-cols-3 gap-2 rounded-2xl bg-bg p-3 text-center">
            <div>
              <dt className="text-xs text-muted">조리 시간</dt>
              <dd className="num mt-0.5 text-ink">{minutes(menu.time)}</dd>
            </div>
            <div className="border-x border-line">
              <dt className="text-xs text-muted">난이도</dt>
              <dd className="mt-0.5">
                <Stars level={menu.difficulty} />
                <span className="num ml-1 text-xs text-muted">{difficultyLabel(menu.difficulty)}</span>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">예상 비용</dt>
              <dd className="num mt-0.5 text-ink">{won(menu.cost)}</dd>
            </div>
          </dl>

          <RecommendationReason reasons={menu.reasons} />

          {/* 냉장고 재료 매칭 */}
          <section>
            <h2 className="mb-2 text-sm font-bold text-ink">냉장고 재료</h2>
            <div className="flex flex-wrap gap-1.5">
              {menu.fridgeUse.map((n) => (
                <span key={n} className="inline-flex items-center gap-1 rounded-full bg-ok-soft px-2.5 py-1 text-xs font-medium text-ok">
                  <Icon name="check" size={12} strokeWidth={2.6} /> {n}
                </span>
              ))}
              {menu.buyExtra.map((n) => (
                <span key={n} className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-xs font-medium text-muted">
                  <Icon name="cart" size={12} /> {n} 구매
                </span>
              ))}
            </div>
          </section>

          {/* 재료 */}
          <section>
            <h2 className="mb-2 text-sm font-bold text-ink">재료</h2>
            <ul className="divide-y divide-line rounded-2xl border border-line">
              {menu.ingredients.map((ing) => {
                const nameOnly = ing.split(' ')[0]
                return (
                  <li key={ing} className="flex items-center justify-between px-3.5 py-2.5 text-sm">
                    <span className="text-ink">{ing}</span>
                    {inFridge(nameOnly) ? (
                      <span className="text-xs font-medium text-ok">보유</span>
                    ) : (
                      <span className="text-xs text-muted">구매</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>

          {/* 레시피 */}
          <section>
            <h2 className="mb-2 text-sm font-bold text-ink">이렇게 만들어요</h2>
            <ol className="space-y-2.5">
              {menu.steps.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink/90">
                  <span className="num grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-soft text-xs text-primary">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </section>

          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => toast('장보기 목록에 추가했어요')}
            >
              <Icon name="cart" size={17} /> 장보기 추가
            </Button>
            <Button className="flex-1" onClick={() => toast('오늘 저녁으로 정했어요! 🍽️')}>
              오늘 이거 먹기
            </Button>
          </div>
        </div>
      </article>
    </PageContainer>
  )
}

function BackBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
    >
      <Icon name="back" size={16} /> 뒤로
    </button>
  )
}
