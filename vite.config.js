import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import ViteCompression from 'vite-plugin-compression';
import ViteComponents from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import { EleAdminResolver, styleDeps } from 'ele-admin-pro/lib/utils/resolvers';
import { DynamicAntdLess } from 'ele-admin-pro/lib/utils/dynamic-theme';
import { resolve } from 'path';

export default defineConfig(({ mode, command }) => {
  const isBuild = command === 'build';
  const env = loadEnv(mode, process.cwd());
  return {
    // 在这里增加 base 写子路径，注意这里前后都要有斜杠
    base: '/',
    server: {
      host: '0.0.0.0',
      port: 8000,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          ws: true,
          rewrite: path => path.replace(/^\/api/, '')
        }
      }
    },
    resolve: {
      alias: {
        '@/': resolve(__dirname, 'src') + '/',
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      }
    },
    plugins: [
      vue(),
      // 组件按需引入
      ViteComponents({
        dts: false,
        resolvers: [
          AntDesignVueResolver({
            importStyle: 'less'
          }),
          EleAdminResolver({
            importStyle: true
          })
        ]
      }),
      // gzip 压缩
      ViteCompression({
        disable: !isBuild,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz'
      }),
      // 兼容低版本浏览器
      legacy({
        targets: ['Chrome 63'],
        modernPolyfills: true
      })
    ],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          plugins: [new DynamicAntdLess()]
        }
      }
    },
    optimizeDeps: {
      include: [
        ...styleDeps,
        'ant-design-vue',
        'ant-design-vue/es',
        'ele-admin-pro',
        'ele-admin-pro/es',
        '@ant-design/icons-vue',
        'vuedraggable',
        'dayjs',
        'echarts/core',
        'echarts/charts',
        'echarts/renderers',
        'echarts/components',
        'vue-echarts',
        'echarts-wordcloud',
        'xlsx'
      ]
    },
    build: {
      target: 'chrome63'
    }
  };
});
