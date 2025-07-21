import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import commonjs from 'vite-plugin-commonjs'
import { vitePluginI18n } from 'webpack-in-loader';

export default defineConfig({
  plugins: [vue(), vitePluginI18n(), commonjs()],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm.js', // 使用完整版 Vue2
    },
  },
});