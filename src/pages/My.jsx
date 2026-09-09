import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '../components/layout'
import { ConfirmModal } from '../components/overlays'
import { Icon } from '../components/ui'
import { TASTE_SUMMARY } from '../data/mock'
import { useApp } from '../store/AppStore'

const LINKS = [
  { to: '/my/preferences', icon: 'sliders', label: '취향 · 편식 관리', desc: '재료를 먹는 방식별로 설정' },
  { to: '/cooking', icon: 'chef', label: '요리 실력', desc: '만들 수 있는 요리와 레벨' },
  { to: '/fridge', icon: 'fridge', label: '냉장고 관리', desc: '재료 추가 · 정리' },
]

export default function My() {
  const { skillLevel, fridge, savedIds, resetAll } = useApp()
  const [confirm, setConfirm] = useState(false)

  return (
    <PageContainer width="narrow">
      <h1 className="text-2xl font-extrabold text-ink md:text-3xl">나의 Food Profile</h1>
      <p className="mt-1.5 text-sm text-muted">
        이 정보를 바탕으로 오늘의 저녁을 골라드려요.
      </p>

      {/* 요약 카드 */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-line bg-card p-4">
          <p className="text-xs text-muted">좋아하는 음식</p>
          <p className="mt-1.5 text-sm font-semibold leading-relaxed text-ink">
            {TASTE_SUMMARY.likes.join(' · ')}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-card p-4">
          <p className="text-xs text-muted">피하고 싶은 것</p>
          <p className="mt-1.5 text-sm font-semibold leading-relaxed text-ink">
            {TASTE_SUMMARY.avoid.join(' · ')}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-card p-4">
          <p className="text-xs text-muted">요리 레벨</p>
          <p className="num mt-1.5 text-xl font-extrabold text-ink">
            {skillLevel.toFixed(1)} <span className="text-sm font-semibold text-muted">/ 5</span>
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-card p-4">
          <p className="text-xs text-muted">냉장고</p>
          <p className="num mt-1.5 text-xl font-extrabold text-ink">
            {fridge.length}개 <span className="text-sm font-semibold text-muted">재료</span>
          </p>
        </div>
      </div>

      <p className="num mt-3 text-xs text-muted">찜한 메뉴 {savedIds.length}개</p>

      {/* 설정 링크 */}
      <nav className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
        {LINKS.map((l) => (
          <Link key={l.to} to={l.to} className="flex items-center gap-3.5 px-4 py-4 hover:bg-bg/70">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
              <Icon name={l.icon} size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-ink">{l.label}</span>
              <span className="block text-xs text-muted">{l.desc}</span>
            </span>
            <Icon name="chevronRight" size={18} className="text-muted" />
          </Link>
        ))}
      </nav>

      {/* 설정 */}
      <div className="mt-6 rounded-2xl border border-line bg-card">
        <div className="flex items-center gap-3.5 px-4 py-4">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-bg text-muted">
            <Icon name="bell" size={18} />
          </span>
          <span className="flex-1 text-sm font-semibold text-ink">저녁 시간 추천 알림</span>
          <span className="text-xs text-muted">준비 중</span>
        </div>
        <div className="border-t border-line px-4 py-4">
          <button
            onClick={() => setConfirm(true)}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink"
          >
            <Icon name="refresh" size={16} /> 처음 상태로 되돌리기
          </button>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-muted">
        모든 데이터는 이 브라우저에만 저장돼요. (mock 프로토타입)
      </p>

      <ConfirmModal
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={resetAll}
        title="처음 상태로 되돌릴까요?"
        message="냉장고 · 찜 · 취향 설정이 모두 초기 예시 데이터로 돌아가요."
        confirmText="되돌리기"
        danger
      />
    </PageContainer>
  )
}
