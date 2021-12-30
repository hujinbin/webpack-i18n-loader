require('colors');
const path = require('path');
const fs = require('fs');
const ora = require('ora');
const {
    config_file
} = require('./const');

const Utils = require('../lib/utils');
const FileProcess = require('./fileProcess');
let messages = {};
let rootPath = null

const generateVueFile = (file) => {
    let content = fs.readFileSync(file, 'utf8');
    // // 获取模板部分
    let [, templateContent = ''] = content.match(/<template[^>]*>((.|\n)*)<\/template>/im) || [];
    FileProcess.generateTemplate(messages, templateContent);
    //获取script部分
    let [, scriptContent = ''] = content.match(/<script[^>]*>((.|\n)*)<\/script>/im) || [];
    FileProcess.generateScript(messages, scriptContent);
};

const generateJsFile = (file) => {
    let content = fs.readFileSync(file, 'utf8');
    FileProcess.generateScript(messages, content);
};

module.exports = async function (src) {
    const spinner = ora("➤ 开始清理语言包，请稍后......".blue);
    spinner.start();
    let processFile = ''
    let chData = {} //中文数据
    let enData = {} //译文数据（英文）
    let delKey = {} // 要删除的key
    // 检测有无初始化配置文件
    if (fs.existsSync(config_file)) {
        processFile = path.join(process.cwd(), config_file);
        config = require(processFile);
    } else {
        spinner.fail(`${config_file}文件不存在，请先初始化项目`.red);
        return;
    }
    // 读取中文文件
    if (fs.existsSync(config.dir + config.file)) {
        processFile = path.join(process.cwd(), config.dir + config.file);
        chData = require(processFile)
    } else {
        spinner.fail(`中文语言包不存在,${config.dir+config.file}\n`.red);
        return;
    }

    let langList = [] // 已有的语言列表  如 ['en']
    try {
        //   获取所有的需要导入的语言
        fs.readdirSync(config.dir).forEach(file => {
            //  en.js.map转化
            const lang = file.split('.')[0]
            if (file.indexOf('js.map') !== -1) {
                langList.push(lang)
            }
        });
    } catch (e) {}
    // ----- 重新抓取中文，得到在使用得语言包 messages -----
    rootPath = path.join(process.cwd(), src);
    Utils.getAllFiles(rootPath).forEach(file => {
        if (file.indexOf(config.dir) < 0) {
            path.extname(file) === '.vue' ? generateVueFile(file) : generateJsFile(file);
        }
    });
    // ----- 重新抓取中文，得到在使用得语言包 messages -----
    
    // 处理中文，获取被删除的key值
    Object.keys(chData).forEach(key=>{
        if(!messages.hasOwnProperty(key)){
            const value = chData[key];
            const md5 = Utils.Md5_16(value);
            if(md5 === key){
                delKey[key] = value;
                // 删除已无用的中文
                delete chData[key]
            }
        }
    })
    rootPath = path.join(process.cwd(), config.dir + config.file);
    fs.writeFileSync(rootPath, `module.exports = ${JSON.stringify(chData, null, '\t')};`, 'utf8');
    spinner.succeed("zh.js已清理完成".green);

    console.log(langList)
    // 同步导入所有国际化文件
    langList.forEach((lang) => {
        // 读取已经翻译的英文文件等
        // if (fs.existsSync(config.dir + lang + '.js')) {
        //     processFile = path.join(process.cwd(), config.dir + lang + '.js');
        //     enData = require(processFile)
        // }
        // const DataArray = Object.keys(chData)
        // DataArray.forEach((key) => {
        //     chData[chData[key]] = key
        // })
        // // 读取map文件的数据
        // let map = {} // map表数据
        // const mapFile = path.join(process.cwd(), config.dir + lang + '.js.map');
        // if (fs.existsSync(mapFile)) {
        //     const mapData = fs.readFileSync(mapFile, 'utf8');
        //     try {
        //         map = JSON.parse(mapData)
        //     } catch (e) {
        //         map = {}
        //     }
        // }
        // Object.keys(map).forEach((key) => {
        //     const enKey = chData[key]
        //     if (enKey) {
        //         const value = map[key]
        //         enData[enKey] = value;
        //     }
        // })
        // const file = path.join(process.cwd(), config.dir + lang + '.js');
        // fs.writeFileSync(file, `module.exports = ${JSON.stringify(enData, null, '\t')};`, 'utf8');
        spinner.succeed(`${lang}.js和${lang}.js.map已清理完成`.green);
    })
}