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
    let enData = {} //译文数据（英文）
    // 检测有无初始化配置文件
    if (fs.existsSync(config_file)) {
        processFile = path.join(process.cwd(), config_file);
        config = require(processFile);
    } else {
        spinner.fail(`${config_file}文件不存在，请先初始化项目\n`.red);
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

    let mapFileList = [] // 已有的语言  如 ['en']
    try {
        //   获取所有的需要导入的语言
        fs.readdirSync(config.dir).forEach(file => {
            //  en.js.map转化
            const lang = file.split('.')[0]
            if (file.indexOf('js.map') !== -1) {
                mapFileList.push(lang)
            }
        });
    } catch (e) {}
    // 同步导入所有国际化文件
    mapFileList.forEach((lang) => {
        // 读取已经翻译的英文文件等
        if (fs.existsSync(config.dir + lang+'.js')) {
            processFile = path.join(process.cwd(), config.dir + lang + '.js');
            enData = require(processFile)
        }
        const DataArray = Object.keys(chData)
        DataArray.forEach((key) => {
            chData[chData[key]] = key
        })
        // 读取map文件的数据
        let map = {} // map表数据
        const mapFile = path.join(process.cwd(), config.dir + lang+ '.js.map');
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
        const file = path.join(process.cwd(), config.dir + lang+ '.js');
        fs.writeFileSync(file, `module.exports = ${JSON.stringify(enData, null, '\t')};`, 'utf8');
        spinner.succeed(`map映射表成功导入${lang}.js`.green);
    })
}