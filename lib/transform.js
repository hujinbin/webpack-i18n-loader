require('colors');
const path = require('path');
const fs = require('fs');
const ora = require('ora');
const {
    config_file
} = require('./const');


module.exports = async function () {
    const spinner = ora("➤ 开始导入，请稍后......".blue);
    spinner.start();
    let processFile = ''
    let chData = {} //中文数据
    let enData = {} //英文数据
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
        spinner.fail(`中文语言包不存在,${config.dir+config.file}`.red);
        return;
    }

    try {
        //   同时对已有的其他国际化文件进行更新
        fs.readdirSync(config.dir).forEach(file => {
            file = path.join(config.dir, file);
            console.log(file)
            //   if (file !== i18nFilePath) {
            //     let oldMessages = require(file);
            //     fs.writeFileSync(file, `module.exports = ${JSON.stringify(Object.assign({}, messages, oldMessages), null, '\t')};`, 'utf8');
            //   }
        });
    } catch (e) {}
    // 读取已经翻译的英文文件等
    if (fs.existsSync(config.dir + 'en.js')) {
        processFile = path.join(process.cwd(), config.dir + 'en.js');
        enData = require(processFile)
    }
    const DataArray = Object.keys(chData)
    DataArray.forEach((key) => {
        chData[chData[key]] = key
    })
    // 读取map文件的数据
    let map = {} // map表数据
    const mapFile = path.join(process.cwd(), config.dir + 'en.js.map');
    if (fs.existsSync(mapFile)) {
        const mapData = fs.readFileSync(mapFile, 'utf8');
        try {
            map = JSON.parse(mapData)
        } catch (e) {
            map = {}
        }
    }
    Object.keys(map).forEach((key) => {
        const enKey = chData[key]
        if (enKey) {
            const value = map[key]
            enData[enKey] = value;
        }
    })
    const file = path.join(process.cwd(), config.dir + 'en.js');
    fs.writeFileSync(file, `module.exports = ${JSON.stringify(enData, null, '\t')};`, 'utf8');
    spinner.succeed('map映射表成功导入en.js'.green);
}