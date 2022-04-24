import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/**
 * 构建文档
*/
export default defineConfig({
  plugins: [vue()],
  base: '/videojs-plugin-source-switcher/',
  build: {
    outDir: "docs"
  }
})