import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '../components/layout'
import { MenuCard, DeliveryCard } from '../components/cards'
import { Button, Chip, EmptyState } from '../components/ui'
import { MENUS, DELIVERY } from '../data/mock'
import { useApp } from '../store/AppStore'
const TABS = ['전체', '해먹기', '배달', '손님용']
export default function Saved() {
  const { savedIds } = useApp()
  const [tab, setTab] = useState('전체')
  const cookItems = MENUS.filter((m) => savedIds.includes(m.id))
  const deliveryItems = DELIVERY.filter((m) => savedIds.includes(m.id))
  const showCook = tab === '전체' || tab === '해먹기'
  const showDelivery = tab === '전체' || tab === '배달'
  const showGuest = tab === '전체' || tab === '손님용'
  const nothing = savedIds.length === 0
  return (
    <PageContainer>
      <h1 className="text-2xl font-extrabold text-ink md:text-3xl">
        찜한 메뉴
      </h1>
      <p className="mt-1.5 text-sm text-muted">마음에 든 메뉴를 모아뒀어요.</p>
      {nothing ? (
        <div className="mt-8">
          <EmptyState
            title="아직 저장한 메뉴가 없어요."
            description="마음에 드는 메뉴를 저장해보세요."
            action={
              <Button as={Link} to="/recommend/cook">
                메뉴 둘러보기
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1">
            {TABS.map((t) => (
              <Chip key={t} active={tab === t} onClick={() => setTab(t)}>
                {t}
              </Chip>
            ))}
          </div>
          <div className="mt-5 space-y-8">
            {showCook && cookItems.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-bold text-muted">
                  해먹기 {cookItems.length}
                </h2>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
                  {cookItems.map((m) => (
                    <MenuCard key={m.id} menu={m} />
                  ))}
                </div>
              </section>
            )}
            {showDelivery && deliveryItems.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-bold text-muted">
                  배달 {deliveryItems.length}
                </h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {deliveryItems.map((d) => (
                    <DeliveryCard key={d.id} item={d} />
                  ))}
                </div>
              </section>
            )}
            {showGuest && (
              <EmptyState
                title="저장한 손님상이 없어요."
                description="손님용 메뉴에서 마음에 드는 세트를 저장해보세요."
              />
            )}
            {tab === '해먹기' && cookItems.length === 0 && (
              <EmptyState title="저장한 해먹기 메뉴가 없어요." />
            )}
            {tab === '배달' && deliveryItems.length === 0 && (
              <EmptyState title="저장한 배달 메뉴가 없어요." />
            )}
          </div>
        </>
      )}
    </PageContainer>
  )
}
