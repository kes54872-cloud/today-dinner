import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '../components/layout'
import { BottomSheet } from '../components/overlays'
import { Button, Chip, EmptyState, Icon } from '../components/ui'
import { cx, defaultQty, formatQty, qtyPresets, qtyStep } from '../lib/format'
import { FRIDGE_CATEGORIES, INGREDIENT_CATALOG } from '../data/mock'
import { useApp } from '../store/AppStore'

/* ── 수량 입력 (−/+ 스텝 + 직접 입력 + 빠른 선택) ─────*/
function QuantityField({ unit = '개', value, onChange }) {
  const step = qtyStep(unit)
  return (
    <div>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - step))}
          aria-label="수량 줄이기"
          className="grid h-11 w-11 place-items-center rounded-full border border-line-strong text-ink hover:border-ink/40"
        >
          <Icon name="minus" size={18} />
        </button>
        <span className="flex items-baseline gap-1.5">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={value}
            onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
            aria-label={`수량 (${unit})`}
            className="num w-24 rounded-xl border border-line bg-bg py-2.5 text-center text-xl font-bold text-ink outline-none focus:border-primary"
          />
          <span className="text-sm font-semibold text-muted">{unit}</span>
        </span>
        <button
          type="button"
          onClick={() => onChange(value + step)}
          aria-label="수량 늘리기"
          className="grid h-11 w-11 place-items-center rounded-full border border-line-strong text-ink hover:border-ink/40"
        >
          <Icon name="plus" size={18} />
        </button>
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {qtyPresets(unit).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={cx(
              'num rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
              value === p
                ? 'border-primary bg-primary text-white'
                : 'border-line bg-card text-ink hover:border-line-strong',
            )}
          >
            {p}
            {unit}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── 재료 추가 (2단계) ─────────────────────────────────*/
function AddIngredientSheet({ open, onClose }) {
  const { fridge, addIngredient } = useApp()
  const [step, setStep] = useState(1)
  const [query, setQuery] = useState('')
  const [picked, setPicked] = useState(null)
  const [count, setCount] = useState(1)

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
      title={step === 1 ? '무엇이 있나요?' : `${picked?.name} · 얼마나 있나요?`}
      footer={
        step === 2 && (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStep(1)}>
              이전
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                addIngredient({ ...picked, count, amount: null })
                close()
              }}
            >
              추가하기
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
                      setCount(defaultQty(i.unit))
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
        <div className="space-y-5 py-2">
          <QuantityField
            unit={picked?.unit}
            value={count}
            onChange={setCount}
          />
          <button
            type="button"
            onClick={() => {
              addIngredient({ ...picked, count: null, amount: '적당히' })
              close()
            }}
            className="mx-auto block text-sm text-muted underline underline-offset-2 hover:text-ink"
          >
            정확한 양은 잘 모르겠어요
          </button>
        </div>
      )}
    </BottomSheet>
  )
}

/* ── 수량 수정 ─────────────────────────────────────────*/
function EditIngredientSheet({ item, onClose }) {
  const { updateIngredient, removeIngredient } = useApp()
  const [count, setCount] = useState(item?.count ?? defaultQty(item?.unit))

  return (
    <BottomSheet
      open={!!item}
      onClose={onClose}
      title={item ? `${item.name} 수량` : ''}
      footer={
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              removeIngredient(item.id)
              onClose()
            }}
          >
            <Icon name="trash" size={16} /> 삭제
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              updateIngredient(item.id, { count, amount: null })
              onClose()
            }}
          >
            저장
          </Button>
        </div>
      }
    >
      {item && (
        <div className="py-3">
          <QuantityField unit={item.unit} value={count} onChange={setCount} />
        </div>
      )}
    </BottomSheet>
  )
}

export default function Fridge() {
  const { fridge } = useApp()
  const [sheet, setSheet] = useState(false)
  const [editing, setEditing] = useState(null)
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
              <li key={f.id}>
                <button
                  onClick={() => setEditing(f)}
                  className="flex w-full flex-col items-center gap-1 rounded-2xl border border-line bg-card p-4 text-center transition-colors hover:border-primary/40"
                  aria-label={`${f.name} 수량 수정`}
                >
                  <span className="text-sm font-semibold text-ink">
                    {f.name}
                  </span>
                  <span className="num text-xs text-muted">{formatQty(f)}</span>
                </button>
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
      <EditIngredientSheet
        key={editing?.id}
        item={editing}
        onClose={() => setEditing(null)}
      />
    </PageContainer>
  )
}
