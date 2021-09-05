import 'dotenv/config';
import { resolve } from 'path';

import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import reactRefresh from '@vitejs/plugin-react-refresh';
import vitePluginImp from 'vite-plugin-imp';
import dayjs from 'dayjs';

const config = async ({ command, mode }) => {
  const isProd = mode === 'production';

  return defineConfig({
    root: 'src',
    base: process.env.QD_PUBLIC_PATH || '/',
    publicDir: resolve(process.cwd(), 'public'),
    build: {
      outDir: resolve(process.cwd(), 'dist'),
      emptyOutDir: true,
      sourcemap: true,
      brotliSize: false,
      minify: isProd ? 'terser' : 'esbuild',
    },
    plugins: [
      // https://zhuanlan.zhihu.com/p/358403100
      vitePluginImp({
        libList: [
          {
            libName: 'antd',
            style: (name) => `antd/es/${name}/style`,
          },
        ],
      }),
      reactRefresh(),
      isProd &&
        VitePWA({
          manifest: {
            start_url: '/?utm_source=web_app_manifest',
            scope: '/',
            name: 'CloudFine Console',
            short_name: 'CloudFine',
            background_color: '#fff',
            theme_color: 'black',
            lang: 'zh',
            icons: [128, 512].map((size) => ({
              src: '/logo-circle-light.svg',
              size: `${size}x${size}`,
              type: 'image/svg+xml',
              purpose: 'any maskable',
            })),
          },
          workbox: {
            skipWaiting: true,
            clientsClaim: true,
          },
        }),
    ],
    define: {
      'process.env.RELEASE': JSON.stringify(dayjs().format('YYYYMMDD.HHmmss')),
      'process.env.COMMAND': JSON.stringify(command),
      'process.env.API_BASE': JSON.stringify(process.env.API_BASE),
    },
    server: {
      proxy: {
        '/api/v2': {
          target: 'https://console.duoyun.work',
          changeOrigin: true,
        },
      },
      hmr:{
        overlay: false
      }
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: { '@reset-import': false },
        },
      },
    },
    resolve: {
      alias: {
        src: '',
      },
    },
  });
};

export default config;
