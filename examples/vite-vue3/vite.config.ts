import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import commonjs from 'vite-plugin-commonjs';
import { i18nPlugin } from 'webpack-in-loader';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), i18nPlugin(),commonjs()],
})
