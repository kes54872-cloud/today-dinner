import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '../components/layout'
import { BottomSheet } from '../components/overlays'
import { Button, Chip, EmptyState, Icon } from '../components/ui'
import { AMOUNT_OPTIONS } from '../lib/format'
import { FRIDGE_CATEGORIES, INGREDIENT_CATALOG } from '../data/mock'
import { useApp } from '../store/AppStore'

function AddIngredientSheet({ open, onClose }) {
  const { fridge, addIngredient } = useApp()
  const [step, setStep] = useState(1)
  const [query, setQuery] = useState('')
  const [picked, setPicked] = useState(null)

  const reset = () => {
    setStep(1)
    setQuery('')
    setPicked(null)
  }

  const close = () => {
    onClose()
    setTimeout(reset, 200)
  }

  const results = useMemo(() => {
    const inFridge = new Set(fridge.map((f) => f.id))
    return INGREDIENT_CATALOG.filter(
      (i) => !inFridge.has(i.id) && (!query || i.name.includes(query)),
    ).slice(0, 12)
  }, [fridge, query])

  return (
    <BottomSheet
      open={open}
      onClose={close}
      title={step === 1 ? '무엇이 있나요?' : '얼마나 남았나요?'}
      footer={
        step === 2 && (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStep(1)}>
              이전
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                addIngredient({ ...picked, amount: '모르겠어요', qty: '' })
                close()
              }}
            >
              무게 입력 없이 추가
            </Button>
          </div>
        )
      }
    >
      {step === 1 ? (
        <div className="space-y-4">
          <label className="flex items-center gap-2 rounded-xl border border-line bg-bg px-3.5 py-3">
            <Icon name="search" size={18} className="text-muted" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="재료 검색"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
            />
          </label>
          {results.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              "{query}" 는 목록에 없어요.
              <br />
              검색어를 바꿔보세요.
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-2">
              {results.map((i) => (
                <li key={i.id}>
                  <button
                    onClick={() => {
                      setPicked(i)
                      setStep(2)
                    }}
                    className="flex w-full items-center gap-2 rounded-xl border border-line bg-card px-3.5 py-3 text-left text-sm hover:border-primary/50"
                  >
                    <span className="font-medium text-ink">{i.name}</span>
                    <span className="ml-auto text-muted">
                      <Icon name="plus" size={16} />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl bg-bg px-4 py-3">
            <span className="font-semibold text-ink">{picked?.name}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {AMOUNT_OPTIONS.map((a) => (
              <button
                key={a}
                onClick={() => {
                  addIngredient({ ...picked, amount: a, qty: '' })
                  close()
                }}
                className="rounded-xl border border-line bg-card py-4 text-sm font-medium text-ink hover:border-primary/50 hover:bg-primary-soft"
              >
                {a}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-muted">
            정확한 무게 입력은 선택이에요. 나중에 바꿀 수 있어요.
          </p>
        </div>
      )}
    </BottomSheet>
  )
}

export default function Fridge() {
  const { fridge, removeIngredient } = useApp()
  const [sheet, setSheet] = useState(false)
  const [cat, setCat] = useState('전체')

  const cats = [
    '전체',
    ...FRIDGE_CATEGORIES.filter((c) => fridge.some((f) => f.category === c)),
  ]
  const shown =
    cat === '전체' ? fridge : fridge.filter((f) => f.category === cat)

  return (
    <PageContainer width="narrow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink md:text-3xl">
            내 냉장고
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            지금 있는 재료로 만들 수 있는 메뉴를 찾아보세요.
          </p>
        </div>
        <Button size="sm" onClick={() => setSheet(true)} className="shrink-0">
          <Icon name="plus" size={16} /> 재료 추가
        </Button>
      </div>

      {fridge.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="아직 냉장고가 비어 있어요."
            description="재료를 몇 개만 추가해도 오늘 만들 수 있는 메뉴를 찾아드릴게요."
            action={
              <Button onClick={() => setSheet(true)}>
                <Icon name="plus" size={16} /> 재료 추가하기
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <div className="num mt-5 text-sm text-muted">
            총 <span className="text-primary">{fridge.length}개</span>의 재료
          </div>

          <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
            {cats.map((c) => (
              <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
                {c}
              </Chip>
            ))}
          </div>

          <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {shown.map((f) => (
              <li
                key={f.id}
                className="group relative flex flex-col items-center gap-1 rounded-2xl border border-line bg-card p-4 text-center"
              >
                <button
                  onClick={() => removeIngredient(f.id)}
                  aria-label={`${f.name} 삭제`}
                  className="absolute right-1.5 top-1.5 rounded-full p-1 text-muted opacity-0 transition-opacity hover:bg-line/60 hover:text-ink group-hover:opacity-100 focus-visible:opacity-100"
                >
                  <Icon name="close" size={15} />
                </button>
                <span className="text-sm font-semibold text-ink">{f.name}</span>
                <span className="num text-xs text-muted">
                  {f.qty || f.amount}
                </span>
              </li>
            ))}
          </ul>

          <Link
            to="/fridge/clear"
            className="mt-6 flex items-center gap-3 rounded-[var(--radius-card)] border border-line bg-card p-4 text-sm shadow-[var(--shadow-card)] hover:border-primary/40"
          >
            <span className="font-medium text-ink">
              냉장고 털기 — 지금 재료를 가장 많이 쓰는 메뉴
            </span>
            <Icon
              name="chevronRight"
              size={18}
              className="ml-auto shrink-0 text-muted"
            />
          </Link>
        </>
      )}

      <AddIngredientSheet open={sheet} onClose={() => setSheet(false)} />
    </PageContainer>
  )
}
