import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import commonjs from 'vite-plugin-commonjs';
// 本地开发时使用相对路径引入
import { vitePluginI18n } from '../../vite.mjs';
// 正式使用时应该这样引入：
// import { vitePluginI18n } from 'webpack-in-loader/vite';
import path from 'path';

export default defineConfig({
  plugins: [vitePluginI18n(), vue(), commonjs()],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm.js', // 使用完整版 Vue2
      '@': path.resolve(__dirname, './src'), 
    },
  },
});