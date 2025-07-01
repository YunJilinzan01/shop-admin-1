import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [vue(), vueDevTools()],
    server: {
      sourcemap: true,
    },
    build: {
      // Vite 构建相关配置
      sourcemap: true, // 构建时生成 source map，方便调试
      rollupOptions: {
        // 传递给底层 Rollup 的配置
        output: {
          // 输出相关配置
          manualChunks(id) {
            // 手动拆分 chunk 的函数
            console.log('id:', id)
            if (id.includes('node_modules')) {
              // 如果当前模块来自 node_modules
              if (id.includes('element-plus')) return 'element-plus' // element-plus 单独打包为一个 chunk
              if (id.includes('echarts')) return 'echarts' // echarts 单独打包为一个 chunk
              // 其他 node_modules 下的依赖按包名单独打包
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
