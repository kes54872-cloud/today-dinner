# 오늘 뭐 먹지? 🍳

상황·취향·냉장고 재료를 기억해 "오늘 저녁"을 정해주는 개인 식사 큐레이터.
React + Vite + Tailwind로 만든 **프론트엔드 프로토타입** (백엔드·실 API 없이 mock data로 동작).

## 개발

```bash
npm install
npm run dev      # http://localhost:5173/today-dinner/
npm run build    # dist/ 생성
npm run preview  # 빌드 결과 미리보기
npm run lint
```

## 화면

- **홈** — 상황 선택(해먹기/시켜먹기/냉장고 털기/손님용), 오늘의 추천 + 추천 이유
- **추천 결과** — 안전한 선택 / 새로운 선택 / 한 단계 도전, 필터 칩
- **메뉴 상세** — 레시피, 냉장고 재료 매칭, 추천 이유
- **냉장고** — 재료 목록, 2단계 재료 추가 시트, 냉장고 털기(활용도 시각화)
- **요리** — 요리 레벨, 만들 수 있는 요리, 한 단계 발전(progression)
- **배달/외식** — 배달·포장·외식 필터, 음식 종류 칩
- **손님용** — 인원·분위기·시간·난이도 → 한 끼 세트
- **주간 식단** — 데스크톱 7일 그리드 / 모바일 세로 카드, 장보기
- **찜 / MY** — Food Profile, 취향·편식 관리(재료별 상황별 5단계 선호도)

상태(냉장고·찜·취향)는 브라우저 `localStorage`에만 저장됩니다.

## 배포 (GitHub Pages)

1. 이 폴더를 GitHub 저장소(이름: `today-dinner`)에 push
2. 저장소 **Settings → Pages → Source: GitHub Actions**
3. `main` 브랜치에 push하면 `.github/workflows/deploy.yml`이 자동 빌드·배포
4. 주소: `https://<사용자명>.github.io/today-dinner/`

> 저장소 이름을 다르게 쓰거나 `<사용자>.github.io` 루트에 올릴 경우
> `vite.config.js`의 `base` 값을 맞춰야 합니다.

## 실제 음식 사진 넣기 (선택)

기본은 재료 톤 + 이모지 플레이스홀더입니다. 사진을 쓰려면
`public/menus/파일명.jpg`를 두고 `src/data/mock.js`의 해당 항목에
`photo: '/menus/파일명.jpg'`를 추가하면 자동으로 얹힙니다.
