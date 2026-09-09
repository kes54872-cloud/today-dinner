import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  INITIAL_FRIDGE,
  INITIAL_SAVED,
  MY_RECIPES,
  PREFERENCE_ITEMS,
  WEEK_PLAN,
} from '../data/mock'

// 버전을 올리면 예전에 브라우저에 저장된 상태를 버리고 새 기본값으로 시작합니다.
const KEY = 'today-dinner:v2'

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? {}
  } catch {
    return {}
  }
}

const AppCtx = createContext(null)

export function AppProvider({ children }) {
  const saved0 = load()

  const [fridge, setFridge] = useState(saved0.fridge ?? INITIAL_FRIDGE)
  const [savedIds, setSavedIds] = useState(saved0.savedIds ?? INITIAL_SAVED)
  const [recipes, setRecipes] = useState(saved0.recipes ?? MY_RECIPES)
  const [week, setWeek] = useState(saved0.week ?? WEEK_PLAN)
  // { [ingredientId]: { [contextKey]: value } }
  const [prefs, setPrefs] = useState(saved0.prefs ?? {})
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({ fridge, savedIds, recipes, week, prefs }),
      )
    } catch {
      /* 저장 실패는 조용히 무시 (프라이빗 모드 등) */
    }
  }, [fridge, savedIds, recipes, week, prefs])

  const toast = useCallback((message, opts = {}) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, message, ...opts }])
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, opts.duration ?? 2200)
  }, [])

  const isSaved = useCallback((id) => savedIds.includes(id), [savedIds])

  const toggleSave = useCallback(
    (id, name) => {
      const has = savedIds.includes(id)
      setSavedIds((ids) =>
        ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
      )
      toast(has ? '찜을 해제했어요' : `찜했어요 · ${name ?? '메뉴'}`)
    },
    [savedIds, toast],
  )

  const addIngredient = useCallback(
    (item) => {
      setFridge((f) => {
        if (f.some((x) => x.id === item.id)) return f
        return [...f, item]
      })
      toast(`${item.name} 추가`)
    },
    [toast],
  )

  const removeIngredient = useCallback((id) => {
    setFridge((f) => f.filter((x) => x.id !== id))
  }, [])

  const updateIngredientAmount = useCallback((id, amount) => {
    setFridge((f) => f.map((x) => (x.id === id ? { ...x, amount } : x)))
  }, [])

  const addRecipe = useCallback(
    (name, level) => {
      const id = 'r' + Math.random().toString(36).slice(2, 7)
      setRecipes((r) => [...r, { id, name, level }])
      toast(`"${name}" 을(를) 추가했어요`)
    },
    [toast],
  )

  const removeRecipe = useCallback((id) => {
    setRecipes((r) => r.filter((x) => x.id !== id))
  }, [])

  const setPref = useCallback((ingredientId, contextKey, value) => {
    setPrefs((p) => ({
      ...p,
      [ingredientId]: { ...(p[ingredientId] ?? {}), [contextKey]: value },
    }))
  }, [])

  // 재료의 특정 상황 선호도 (사용자 오버라이드 우선, 없으면 mock 기본값)
  const getPref = useCallback(
    (ingredientId, contextKey) => {
      const override = prefs[ingredientId]?.[contextKey]
      if (override != null) return override
      const item = PREFERENCE_ITEMS.find((i) => i.id === ingredientId)
      return item?.contexts.find((c) => c.key === contextKey)?.value ?? 3
    },
    [prefs],
  )

  const setDay = useCallback((dayIndex, patch) => {
    setWeek((w) => w.map((d, i) => (i === dayIndex ? { ...d, ...patch } : d)))
  }, [])

  const skillLevel = useMemo(() => {
    if (!recipes.length) return 0
    const avg = recipes.reduce((s, r) => s + r.level, 0) / recipes.length
    return Math.round(avg * 10) / 10
  }, [recipes])

  const resetAll = useCallback(() => {
    setFridge(INITIAL_FRIDGE)
    setSavedIds(INITIAL_SAVED)
    setRecipes(MY_RECIPES)
    setWeek(WEEK_PLAN)
    setPrefs({})
    toast('처음 상태로 되돌렸어요')
  }, [toast])

  const value = {
    fridge,
    savedIds,
    recipes,
    week,
    prefs,
    toasts,
    toast,
    isSaved,
    toggleSave,
    addIngredient,
    removeIngredient,
    updateIngredientAmount,
    addRecipe,
    removeRecipe,
    setPref,
    getPref,
    setDay,
    skillLevel,
    resetAll,
  }

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppCtx)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
