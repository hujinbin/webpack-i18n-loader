import { createI18n } from "vue-i18n";
const messages = {
    // "en": {...require('./locale/en')},
    "zh": {...require('./locale/zh')},
};

const i18n = createI18n({
    locale: localStorage.getItem('locale') || 'en', //默认显示的语言
    messages,
});

export default i18n;
