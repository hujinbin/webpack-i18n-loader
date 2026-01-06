import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import commonjs from 'vite-plugin-commonjs';
// 本地开发时使用相对路径引入
import { vitePluginI18n } from '../../vite.mjs';
// 正式使用时应该这样引入：
// import { vitePluginI18n } from 'webpack-in-loader/vite';

// https://vite.dev/config/
export default defineConfig({
  // i18n 插件必须在 vue 插件之前，以便处理原始 .vue 文件
  plugins: [vitePluginI18n(), vue(), commonjs()],
})
