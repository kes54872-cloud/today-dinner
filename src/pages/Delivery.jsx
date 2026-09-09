import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '../components/layout'
import { DeliveryCard } from '../components/cards'
import { Chip, EmptyState, Icon, SegmentedControl } from '../components/ui'
import { DELIVERY } from '../data/mock'
const GENRES = [
  { key: '밥', emoji: '🍚' },
  { key: '면', emoji: '🍜' },
  { key: '고기', emoji: '🍗' },
  { key: '양식', emoji: '🍕' },
  { key: '국물', emoji: '🥘' },
  { key: '매운맛', emoji: '🌶️' },
]
export default function Delivery() {
  const [kind, setKind] = useState('전체')
  const [genre, setGenre] = useState(null)
  const list = useMemo(
    () =>
      DELIVERY.filter(
        (d) =>
          (kind === '전체' || d.kind === kind) && (!genre || d.genre === genre),
      ).sort((a, b) => b.match - a.match),
    [kind, genre],
  )
  return (
    <PageContainer width="narrow">
      <Link
        to="/"
        className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <Icon name="back" size={16} /> 홈
      </Link>
      <h1 className="text-2xl font-extrabold text-ink md:text-3xl">
        오늘은 요리하지 않을래요.
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        취향에 맞는 배달·포장·외식을 골라봤어요.
      </p>
      <div className="mt-5">
        <SegmentedControl
          options={['전체', '배달', '포장', '외식']}
          value={kind}
          onChange={setKind}
        />
      </div>
      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
        {GENRES.map((g) => (
          <Chip
            key={g.key}
            active={genre === g.key}
            onClick={() => setGenre((cur) => (cur === g.key ? null : g.key))}
          >
            <span aria-hidden="true">{g.emoji}</span> {g.key}
          </Chip>
        ))}
      </div>
      {list.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="조건에 맞는 곳이 없어요"
            description="필터를 조금 넓혀보세요."
          />
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {list.map((d) => (
            <DeliveryCard key={d.id} item={d} />
          ))}
        </div>
      )}
      <p className="mt-6 text-center text-xs text-muted">
        실제 배달 서비스와는 연결되어 있지 않은 예시 데이터예요.
      </p>
    </PageContainer>
  )
}
