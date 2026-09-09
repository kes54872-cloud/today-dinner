import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '../components/layout'
import { BottomSheet } from '../components/overlays'
import { Button, Icon, ProgressBar, SectionHead, Stars } from '../components/ui'
import { PROGRESSIONS } from '../data/mock'
import { cx } from '../lib/format'
import { useApp } from '../store/AppStore'

function AddRecipeSheet({ open, onClose }) {
  const { addRecipe } = useApp()
  const [name, setName] = useState('')
  const [level, setLevel] = useState(2)

  const submit = () => {
    if (!name.trim()) return
    addRecipe(name.trim(), level)
    setName('')
    setLevel(2)
    onClose()
  }

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="만들 수 있는 요리 추가"
      footer={
        <Button className="w-full" onClick={submit} disabled={!name.trim()}>
          추가하기
        </Button>
      }
    >
      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-ink">요리 이름</span>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="예: 김치볶음밥"
            className="mt-1.5 w-full rounded-xl border border-line bg-bg px-3.5 py-3 text-sm outline-none focus:border-primary"
          />
        </label>
        <div>
          <span className="text-sm font-medium text-ink">난이도</span>
          <div className="mt-1.5 flex gap-2">
            {[1, 2, 3].map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={cx(
                  'flex-1 rounded-xl border py-3 text-sm font-medium transition-colors',
                  level === l ? 'border-primary bg-primary-soft text-primary' : 'border-line text-muted',
                )}
              >
                <Stars level={l} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </BottomSheet>
  )
}

export default function Cooking() {
  const { recipes, removeRecipe, skillLevel } = useApp()
  const [sheet, setSheet] = useState(false)

  return (
    <PageContainer width="narrow">
      <h1 className="text-2xl font-extrabold text-ink md:text-3xl">내가 만들 수 있는 요리</h1>
      <p className="mt-1.5 text-sm text-muted">
        만들 줄 아는 요리를 알려주면 딱 맞는 난이도로 추천해드려요.
      </p>

      {/* 요리 레벨 */}
      <div className="mt-5 rounded-[var(--radius-card)] border border-line bg-card p-5 shadow-[var(--shadow-card)]">
        <p className="text-sm text-muted">나의 요리 레벨</p>
        <p className="num mt-1 text-4xl font-extrabold text-ink">
          {skillLevel.toFixed(1)} <span className="text-lg font-semibold text-muted">/ 5</span>
        </p>
        <ProgressBar value={(skillLevel / 5) * 100} label="요리 레벨" className="mt-3" />
        <p className="mt-2 text-xs text-muted">
          만들 수 있는 요리 {recipes.length}개의 평균 난이도로 계산해요.
        </p>
      </div>

      {/* 요리 목록 */}
      <div className="mt-8">
        <SectionHead
          title="만들 수 있는 요리"
          right={
            <button
              onClick={() => setSheet(true)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
            >
              <Icon name="plus" size={16} /> 추가
            </button>
          }
        />
        <ul className="divide-y divide-line rounded-2xl border border-line bg-card">
          {recipes.map((r) => (
            <li key={r.id} className="group flex items-center justify-between gap-3 px-4 py-3">
              <span className="text-sm font-medium text-ink">{r.name}</span>
              <div className="flex items-center gap-3">
                <Stars level={r.level} />
                <button
                  onClick={() => removeRecipe(r.id)}
                  aria-label={`${r.name} 삭제`}
                  className="rounded-full p-1 text-muted opacity-0 hover:bg-line/60 hover:text-ink group-hover:opacity-100 focus-visible:opacity-100"
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            </li>
          ))}
          {recipes.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-muted">
              아직 등록한 요리가 없어요.
            </li>
          )}
        </ul>
      </div>

      {/* 한 단계 발전 */}
      <section className="mt-9 rounded-[var(--radius-card)] border border-primary/25 bg-primary-soft/50 p-5">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">👩‍🍳</span>
          <h2 className="text-lg font-bold text-ink">다음 레벨의 요리</h2>
        </div>
        <p className="mt-1 text-sm text-muted">익숙한 메뉴에서 한 단계만 더.</p>

        <div className="mt-4 space-y-4">
          {PROGRESSIONS.map((p) => (
            <div key={p.base} className="rounded-2xl border border-line bg-card p-4">
              <ol>
                {p.steps.map((s, i) => (
                  <li key={s.name} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={cx(
                          'num grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs',
                          i === 0 ? 'bg-ok text-white' : 'bg-bg text-muted',
                        )}
                      >
                        {i === 0 ? <Icon name="check" size={13} strokeWidth={2.6} /> : i + 1}
                      </span>
                      {i < p.steps.length - 1 && <span className="my-1 w-px flex-1 bg-line" aria-hidden="true" />}
                    </div>
                    <div className={cx('min-w-0 flex-1', i < p.steps.length - 1 && 'pb-3')}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-ink">{s.name}</span>
                        <Stars level={s.level} className="ml-auto text-xs" />
                      </div>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted">{s.note}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <Link
        to="/recommend/cook"
        className="mt-6 flex items-center justify-center gap-2 rounded-full border border-line-strong bg-card py-3 text-sm font-semibold text-ink hover:border-ink/40"
      >
        지금 실력으로 할 수 있는 메뉴 보기 <Icon name="arrowRight" size={16} />
      </Link>

      <AddRecipeSheet open={sheet} onClose={() => setSheet(false)} />
    </PageContainer>
  )
}
