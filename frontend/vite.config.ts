import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'embeded' ? './' : '/',
  plugins: [react()],
}))

// export default defineConfig({
//   plugins: [react()],
// })
