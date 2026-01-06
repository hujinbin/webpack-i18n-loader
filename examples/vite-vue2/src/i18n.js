import Vue from 'vue';
import VueI18n from 'vue-i18n';
// 直接导入语言包文件
import zhMessages from './locale/zh.js';
import enMessages from './locale/en.js';

Vue.use(VueI18n);

console.log('=== i18n initialization ===');
console.log('zh messages:', zhMessages);
console.log('zh message count:', Object.keys(zhMessages).length);
console.log('en messages:', enMessages);
console.log('en message count:', Object.keys(enMessages).length);

// 创建 i18n 实例
const i18n = new VueI18n({
    locale: localStorage.getItem('locale') || 'zh',
    fallbackLocale: 'zh',
    messages: {
        zh: zhMessages,
        en: enMessages
    },
    silentTranslationWarn: false,
    silentFallbackWarn: false
});

console.log('i18n instance created');
console.log('Available locales:', i18n.availableLocales);
console.log('Current locale:', i18n.locale);
console.log('Sample translation for 35a9443eb81f48e1:', i18n.t('35a9443eb81f48e1'));

export default i18n;
