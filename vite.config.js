import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createHtmlPlugin } from 'vite-plugin-html'
const { resolve } = require('path')

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return defineConfig({
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    plugins: [vue(), createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          global: `<script type="text/javascript" src="/js/global.js"></script>
                 <script type="text/javascript" src="/js/jquery.js"></script>
                 <script type="text/javascript" src="/js/layer.js"></script>
                 <script type="text/javascript" src="/js/axios.js"></script>
                 <script type="text/javascript" src="/js/apis.js"></script>`
        },
      },
    })]
  })
}
