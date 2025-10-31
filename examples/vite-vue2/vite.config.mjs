import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import commonjs from 'vite-plugin-commonjs';
// @ts-ignore
import { vitePluginI18n } from '../../vite.mjs';
import path from 'path';

export default defineConfig({
  plugins: [vue(), vitePluginI18n(), commonjs()],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm.js', // 使用完整版 Vue2
      '@': path.resolve(__dirname, './src'),
    },
  },
});