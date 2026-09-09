import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// 저장소 이름이 today-dinner 라고 가정합니다.
// GitHub Pages 주소가 https://<사용자>.github.io/today-dinner/ 형태이므로 base 를 맞춰줍니다.
// (사용자 페이지 <사용자>.github.io 루트에 올릴 거라면 base 를 '/' 로 바꾸세요.)
export default defineConfig({
  base: '/today-dinner/',
  plugins: [react(), tailwindcss()],
})
