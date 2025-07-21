import Vue from 'vue';
import VueI18n from 'vue-i18n';
import * as zhModule from './locale/zh.js';
// import en from './locale/en';

const zh = zhModule.default || zhModule;

Vue.use(VueI18n);

const messages = {
    // en,
    zh,
};

const i18n = new VueI18n({
    locale: localStorage.getItem('locale') || 'en', //默认显示的语言
    messages,
});

export default i18n;
