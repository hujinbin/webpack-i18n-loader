import { createI18n } from "vue-i18n";


interface LocaleMessages {
    [key: string]: any;
}

const loadLocaleMessages = async (): Promise<LocaleMessages> => {
    const modules: Record<string, () => Promise<any>> = import.meta.glob('./locale/*.js');
    const zhModule = await modules['./locale/zh.js']();
    return {
        zh: zhModule.default || zhModule
    };
};

const messages: LocaleMessages = await loadLocaleMessages();


// const messages : any = {
//     // "en": {...require('./locale/en')},
//     "zh": zh,
// };

const i18n = createI18n({
    locale: localStorage.getItem('locale') || 'en', //默认显示的语言
    messages,
});

export default i18n;
