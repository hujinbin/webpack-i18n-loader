import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

// 动态导入语言包，兼容 CommonJS 和 ESM
let zh = {};
let en = {};

// 在 Vite 环境中使用动态导入来加载 CommonJS 模块
async function loadLocales() {
  try {
    // 使用动态导入加载 CommonJS 模块
    const zhModule = await import('./locale/zh.js');
    zh = zhModule.default || zhModule;
  } catch (error) {
    console.warn('Failed to load zh locale:', error);
  }

  try {
    const enModule = await import('./locale/en.js');
    en = enModule.default || enModule;
  } catch (error) {
    // 如果没有英文包，使用中文内容作为英文显示
    en = { ...zh };
  }
}

// 创建 i18n 实例
const i18n = new VueI18n({
    locale: localStorage.getItem('locale') || 'zh',
    fallbackLocale: 'zh',
    messages: {
        zh: {},
        en: {}
    },
    silentTranslationWarn: true,
    silentFallbackWarn: true
});

// 异步加载语言包并更新 i18n 实例
loadLocales().then(() => {
    // 更新语言包
    i18n.setLocaleMessage('zh', zh);
    i18n.setLocaleMessage('en', en);
});

export default i18n;
