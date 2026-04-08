/**
 * @desc 项目配置文件配置信息
 */

const config_file = 'i18n-config.js';

const config = `{
    dir: "./src/locale/", // 目标目录
    file: 'zh.js', // 翻译的文件
    distLangs: ['en'], // 要翻译的语言
    open: true, // leader是否启用 默认true
    mode:'Baidu', //翻译方式: 1.Baidu:百度翻译 2:chatGPT/AI:AI翻译(兼容openai及所有OpenAI兼容接口)
    appId:'', // 百度翻译appid
    secret:'', // 百度翻译密钥
    openAiKey: '', // AI翻译密钥 (兼容旧配置，等同于aiKey)
    aiKey: '', // AI翻译密钥 (优先级高于 openAiKey)
    aiModel: '', // AI模型名称，如 'gpt-4'、'gpt-3.5-turbo'、'claude-3-sonnet-20240229'、'deepseek-chat' 等，不填默认 gpt-3.5-turbo
    aiBaseUrl: '', // AI服务API地址，不填默认 OpenAI 官方地址。使用其他厂商时需填写，如：'https://api.deepseek.com/v1'
    singleNum: 3000, //百度翻译单次请求最长次数 可配置范围（3900 - 600）不填则为默认值 1500（百度账号不同等级最长次数不同）
}`;


const languages = {
    en: "English",
    zh: "Chinese (Simplified)",
};

module.exports = {
    config_file,
    config,
    languages,
}