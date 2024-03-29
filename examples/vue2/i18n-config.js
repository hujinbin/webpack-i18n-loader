module.exports = {
    dir: "./src/locale/", // 目标目录
    file: 'zh.js', // 翻译的文件
    distLangs: ['en'], // 要翻译的语言
    open: true, // leader是否启用 默认true
    mode:'chatGPT', //翻译方式: 1.Baidu:百度翻译 2:chatGPT:openai翻译
    appId:'', // 百度翻译appid
    secret:'', // 百度翻译密钥
    openAiKey: '', // chatGPT key
    singleNum: 3000, //单次请求最长次数
};