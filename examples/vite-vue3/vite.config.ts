import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import commonjs from 'vite-plugin-commonjs';
import { vitePluginI18n } from 'webpack-in-loader';
// import { vitePluginI18n } from '../../index.js';

console.log(vitePluginI18n)

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vitePluginI18n(), commonjs()],
})
