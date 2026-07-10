import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path must match the GitHub Pages URL for this repo:
//   https://dandao0806.github.io/playground-usertesting-share-/
// (repo name has a trailing dash, so the base path does too)
// Without it, all built asset URLs (/assets/*, /icons/*) would 404.
export default defineConfig({
  base: '/playground-usertesting-share-/',
  plugins: [react()],
  server: { port: 5173, open: true },
})
