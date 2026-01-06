# Vite 插件使用说明

## 安装

```bash
npm install webpack-in-loader --save-dev
```

## 在 Vite 项目中使用

### 1. 引入插件

在 `vite.config.js` 或 `vite.config.ts` 中引入插件：

```javascript
// ESM 方式（推荐）
import { vitePluginI18n } from 'webpack-in-loader/vite';

// 或者使用完整路径
import { vitePluginI18n } from 'webpack-in-loader/vite.mjs';
```

### 2. 配置插件

```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { vitePluginI18n } from 'webpack-in-loader/vite';

export default defineConfig({
  plugins: [
    vue(),
    vitePluginI18n()
  ]
});
```

### 3. 创建配置文件

在项目根目录创建 `i18n-config.js`：

```javascript
module.exports = {
  dir: './src/locale/',  // 语言包目录
  file: 'zh.js',         // 语言包文件名
  open: true             // 是否启用插件
};
```

### 4. 创建语言包文件

在 `src/locale/zh.js` 中定义语言包：

```javascript
export default {
  '你好': 'Hello',
  '世界': 'World'
};
```

## 功能特性

### 热更新支持

插件支持语言包文件的热更新。当你修改语言包文件时：

1. 插件会自动检测到变化
2. 清除内部缓存
3. 触发所有 `.vue` 文件重新转换
4. 页面会自动刷新显示最新的翻译

### 支持的文件类型

- `.vue` 文件（template 和 script 部分）
- `.js` / `.jsx` 文件
- `.ts` / `.tsx` 文件

### 排除规则

以下文件会被自动跳过处理：

- `node_modules` 目录下的文件
- 语言包目录下的文件（避免循环引用）

## 开发示例

查看 `examples` 目录下的示例项目：

- `examples/vite-vue2/` - Vue 2 + Vite 示例
- `examples/vite-vue3/` - Vue 3 + Vite 示例

## 常见问题

### Q: 语言切换不生效？

**A:** 确保：
1. `i18n-config.js` 配置正确
2. 语言包文件路径正确
3. 开发服务器正在运行
4. 修改语言包后等待热更新完成（会看到控制台日志）

### Q: TypeScript 项目报错？

**A:** 插件已包含类型声明文件 `vite.d.ts`，确保正确引入：

```typescript
import { vitePluginI18n } from 'webpack-in-loader/vite';
```

### Q: 本地开发时如何引用？

**A:** 如果你在开发这个包本身，使用相对路径：

```javascript
import { vitePluginI18n } from '../../vite.mjs';
```

## 与 Webpack Loader 的区别

- **Webpack Loader**: 使用 `require('webpack-in-loader')` 在 webpack 配置中
- **Vite Plugin**: 使用 `import { vitePluginI18n } from 'webpack-in-loader/vite'` 在 vite 配置中

两者功能相同，但适用于不同的构建工具。

## 调试

开发模式下，插件会输出调试信息到控制台：

```
template==================
[template content]
Language pack updated, clearing cache...
Reloading 5 Vue modules...
```

这些信息可以帮助你了解插件的工作状态。
