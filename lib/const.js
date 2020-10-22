/**
 * @desc 项目配置文件配置信息
 */

const config_file = 'i18n-config.js';

const config = {
    dir: "./src/locale/", // 目标目录
    file: 'zh.js', // 翻译的文件
    distLangs: ['en'], // 要翻译的语言
    appId:'', // 百度翻译appid
    secret:'', // 百度翻译密钥
};

module.exports = {
    config_file,
    config,
}