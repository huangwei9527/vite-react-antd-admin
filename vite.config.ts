import { defineConfig, normalizePath, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import viteEslint from 'vite-plugin-eslint'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    build: {
      sourcemap: !(env.VITE_ENV_NAME === 'production'),
      minify: 'terser',
      terserOptions: {
        compress: {
          //生产环境时移除debugger
          drop_debugger: true
        }
      }
    },
    define: {
      'process.env': process.env
    },
    plugins: [react(), viteEslint({ failOnError: false }), tsconfigPaths()],
    resolve: {
      alias: [
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src')
        },
        {
          find: 'styles',
          replacement: path.resolve(__dirname, 'src/styles')
        }
      ]
    },
    // css 相关的配置
    css: {
      modules: {
        generateScopedName: '[name]__[local]___[hash:base64:5]'
      },
      // LESS， 这里是 LESS 的配置可以忽略
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          charset: false,
          globalVars: {
            // 配置Less的全局变量
            // blue:"#1CC0FF"
          }
        }
      }
    },
    server: {
      host: true,
      proxy: {
        '/api': {
          target: 'http://xxx.xxx.com', // 设置你调用的接口域名和端口号 别忘了加http
          changeOrigin: true // needed for virtual hosted sites
        }
      }
    }
  }
})
