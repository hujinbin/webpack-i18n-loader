import Vue from 'vue';
import VueI18n from 'vue-i18n';
import zh from './locale/zh';
import en from './locale/en';

Vue.use(VueI18n);

const messages = {
    en,
    zh,
};

const i18n = new VueI18n({
    locale: localStorage.getItem('locale') || 'en', //默认显示的语言
    messages,
});

export default i18n;
