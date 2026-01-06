import { Plugin } from 'vite';

/**
 * Vite 插件选项
 */
export interface VitePluginI18nOptions {
  /**
   * 语言包文件路径（相对于项目根目录）
   * @default './src/locale/zh.js'
   */
  localeFile?: string;
}

/**
 * Vite i18n 插件
 * 用于在构建时自动替换代码中的中文文本为 i18n 函数调用
 * 
 * @example
 * ```ts
 * import { vitePluginI18n } from 'webpack-in-loader/vite';
 * 
 * export default defineConfig({
 *   plugins: [
 *     vitePluginI18n()
 *   ]
 * });
 * ```
 */
export function vitePluginI18n(options?: VitePluginI18nOptions): Plugin;
