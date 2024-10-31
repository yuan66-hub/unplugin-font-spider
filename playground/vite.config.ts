import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Unplugin from '../src/vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
    Inspect(),
    Unplugin({
      routers: ['/page1', '/page2']
    }),
  ],
})
