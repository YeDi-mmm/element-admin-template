import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';
import { viteMockServe } from 'vite-plugin-mock'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import viteESLint from '@ehutch79/vite-eslint'

// https://vitejs.dev/config/
export default env => {
  return defineConfig({
    base: './',
    plugins: [
      vue(),
      viteMockServe({
        ignore: /^_/, // 忽略以下划线`_`开头的文件
        mockPath: 'mock', // 指定mock目录中的文件全部是mock接口
        supportTs: false, // mockPath目录中的文件是否支持ts文件，现在我们不使用ts，所以设为false
        localEnabled: env.mode === 'mock', // 开发环境是否开启mock功能（可以在package.json的启动命令中指定mode为mock）
        prodEnabled: env.mode === 'mock', // 生产环境是否开启mock功能
        injectCode: `
          import { setupProdMockServer } from '../mock/_createProductionServer';
          setupProdMockServer();
        `,
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [resolve(process.cwd(), 'src/assets/svg')],
        // 指定symbolId格式
        symbolId: '[name]',
        /**
         * 自定义插入位置
         * @default: body-last
         */
        // inject?: 'body-last' | 'body-first'
        /**
         * custom dom id
         * @default: __svg__icons__dom__
         */
        // customDomId: '__svg__icons__dom__',
      }),
      viteESLint({
        include: ['src/**/*.vue', 'src/**/*.js'],
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          // 全局变量
          // additionalData: '@import "./src/assets/style/global-variables.scss";',
          // element-plus升级到v2需要改成以下写法
          additionalData: `@use "./src/assets/style/global-variables.scss" as *;`,
        },
      },
    },
    resolve: {
      alias: [
        { find: '@', replacement: '/src' },
        { find: 'vue-i18n', replacement: 'vue-i18n/dist/vue-i18n.cjs.js' }
      ]
    },
    server: {
      port: 3001,
      open: true,
      proxy: {
        '/api': {
          target: 'http://dev.api.xxx.com', // 后端接口的域名
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    esbuild: false,
    build: {
      terserOptions: {
        compress: {
          keep_infinity: true,
          // 删除console
          drop_console: true,
        },
      },
      // 禁用该功能可能会提高大型项目的构建性能
      brotliSize: false,
      rollupOptions: {
        output: {
          // 拆分单独模块
          manualChunks: {
            'element-plus': ['element-plus'],
            mockjs: ['mockjs'],
          },
        },
      },
    },
  })
}
