// 화면에 반복해서 쓰이는 표기 헬퍼

export const won = (n) => `${n.toLocaleString('ko-KR')}원`

export const minutes = (n) => `${n}분`

// 난이도 1~3 → 별 문자열 (fallback / aria 용). 범위를 벗어난 값도 안전하게.
export const starText = (level) => {
  const l = Math.max(0, Math.min(3, level))
  return '★★★☆☆☆'.slice(3 - l, 6 - l)
}

export const difficultyLabel = (level) =>
  ({ 1: '쉬움', 2: '보통', 3: '도전' })[level] ?? '보통'

// 5단계 편식 선호도
export const PREF_SCALE = [
  { value: 1, emoji: '😖', label: '절대 싫어요' },
  { value: 2, emoji: '🙅', label: '가능하면 피하고 싶어요' },
  { value: 3, emoji: '😐', label: '상황에 따라 괜찮아요' },
  { value: 4, emoji: '🙂', label: '괜찮아요' },
  { value: 5, emoji: '❤️', label: '좋아해요' },
]

export const prefMeta = (value) =>
  PREF_SCALE.find((p) => p.value === value) ?? PREF_SCALE[2]

// 재료 보유량 (대략)
export const AMOUNT_OPTIONS = ['조금', '반 정도', '많이', '모르겠어요']

// 재료 수량 입력 — 단위별 증감 폭 / 빠른 선택값 / 기본값
export const qtyStep = (unit) => (unit === 'g' ? 50 : unit === 'ml' ? 100 : 1)

export const qtyPresets = (unit) =>
  unit === 'g'
    ? [100, 200, 300, 500]
    : unit === 'ml'
      ? [200, 500, 1000]
      : [1, 2, 3, 5]

export const defaultQty = (unit) =>
  unit === 'g' ? 200 : unit === 'ml' ? 500 : 1

// 냉장고 항목 → "3개" / "약 300g" 같은 표시 문자열
export const formatQty = (item) => {
  if (item.count != null && item.unit) {
    const approx = item.unit === 'g' || item.unit === 'ml' ? '약 ' : ''
    return `${approx}${item.count}${item.unit}`
  }
  return item.qty || item.amount || ''
}

export const cx = (...parts) => parts.filter(Boolean).join(' ')

// 메뉴가 특정 재료(이름)를 쓰는지 — fridgeUse 목록 + 재료 표기 텍스트까지 확인
export const menuUsesIngredient = (menu, name) => {
  if (!name) return false
  const hit = (n) => n === name || n.includes(name) || name.includes(n)
  if (menu.fridgeUse?.some(hit)) return true
  return (menu.ingredients ?? []).some((ing) => ing.includes(name))
}

// 메뉴가 쓰는 재료 중 지금 냉장고에 있는 것의 개수 (직접 추가한 재료도 반영)
export const fridgeMatchCount = (menu, fridge) => {
  if (!fridge?.length) return 0
  return fridge.filter((f) => menuUsesIngredient(menu, f.name)).length
}

// 추천 이유 — 실제 냉장고 상태에 맞춰 "냉장고" 문구를 보정
export const explainReasons = (menu, fridge) => {
  const count = fridgeMatchCount(menu, fridge)
  return (menu.reasons ?? [])
    .filter((r) => count > 0 || !r.includes('냉장고'))
    .map((r) =>
      count > 0 ? r.replace(/냉장고 재료 \d+개/g, `냉장고 재료 ${count}개`) : r,
    )
}
