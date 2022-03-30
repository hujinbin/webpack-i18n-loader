require('colors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const ora = require('ora');
const Utils = require('../lib/utils');
const {
    config_file
} = require('./const');

let map = {} // 遍历映射中英文对象
let result = {}; // map 中英文对照表，result 翻译结果
let fromData = {}; // 需要翻译的中文包
let config = {} // 项目配置文件
let toCode = '' //要翻译的语言

const translate = (val, keyList) => {
    const appid = config.appId;
    const key = config.secret;
    const salt = (new Date).getTime(); //取当前时间作为随机数
    const query = val; // 需要搜索的值
    const str1 = appid + query + salt + key; //秘钥
    const sign = Utils.Md5(str1); //md5加密
    return new Promise(function (resolve, reject) {
        axios({
            url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
            params: {
                q: query,
                appid: appid,
                salt: salt,
                from: 'auto',
                to: toCode, //要翻译的语言
                sign: sign
            },
            method: 'GET'
        }).then((res) => {
            if (res.data) {
                const data = res.data;
                if (data.error_code) {
                    console.log('X 百度翻译未成功翻译\n'.red)
                    console.log(data)
                    console.log('\n')
                } else {
                    const trans_result = data.trans_result
                    trans_result.forEach((item, index) => {
                        if(toCode === 'en'){
                            let dst = Utils.replaceStr(item.src,item.dst)
                            map[item.src] = dst
                            result[keyList[index]] = dst
                        }else{
                            map[item.src] = item.dst
                            result[keyList[index]] = item.dst
                        }
                    })
                }
                setTimeout(() => {
                    if (data.error_code) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                }, 1500)
            }
        }).catch((err)=>{
            reject(err)
            console.log('X 百度翻译出现网络错误\n'.red)
        })
    })
}

module.exports = async function (code, filename) {
    toCode = code
    let processFile = ''
    const spinner = ora("➤ 正在翻译中，请稍后......".blue);
    spinner.start();
    // 检测有无初始化配置文件
    if (fs.existsSync(config_file)) {
        processFile = path.join(process.cwd(), config_file);
        config = require(processFile);
    } else {
        spinner.fail(`${config_file}文件不存在，请先初始化项目\n`.red);
        return;
    }
    let file = config.file
   
    let filePath = config.dir + toCode
    if(filename){
        file = filename.indexOf('.') >-1 ? filename : `${filename}.js`
        const pointLocation = file.indexOf('.');
        const toCodeName =  file.substr(0,pointLocation);
        filePath = config.dir + toCode +'-'+ toCodeName
    }
    // 读取需要翻译的中文文件
    if (fs.existsSync(config.dir + file)) {
        processFile = path.join(process.cwd(), config.dir + file);
        fromData = require(processFile)
    } else {
        spinner.fail(`需要翻译的文件不存在,${config.dir+file}\n`.red);
        return;
    }
    // 已有翻译的数据
    let oldData = {}
    if (fs.existsSync(filePath + '.js')) {
        processFile = path.join(process.cwd(), filePath + '.js');
        oldData = require(processFile)
        result = oldData;
    }
    let query = ''
    let keyList = []
    const oldDataArray = Object.keys(oldData)
    // 通过对比中文json和英文josn，取出未翻译的中文json
    const fromDataArray = Object.keys(fromData).filter(val => {
        return oldDataArray.indexOf(val) === -1
    })
    oldDataArray.forEach((key) => {
        map[fromData[key]] = oldData[key]
    })
    let translateState = true; // 翻译成功与否的状态
    const fromDataArrayLen = fromDataArray.length
    for (let i = 0; i < fromDataArrayLen; i++) {
        const key = fromDataArray[i]
        if (translateState) {
            if (String(query).length >= 1500) {
                translateState = await translate(query, keyList);
                query = fromData[key]
                keyList = [key]
            } else {
                query += '\n' + fromData[key]
                keyList.push(key)
                if (i === fromDataArray.length - 1) {
                    translateState = await translate(query, keyList);
                }
            }
        }
    }
    if (translateState) {
        const mapFile = path.join(process.cwd(), filePath + '.js.map');
        if (fs.existsSync(mapFile)) {
            let oldMap = fs.readFileSync(mapFile, 'utf8');
            try {
                oldMap = JSON.parse(oldMap)
            } catch (e) {
                oldMap = {}
            }
            map = {
                ...map,
                ...oldMap
            };
        }
        const file = path.join(process.cwd(), filePath + '.js');
        fs.writeFileSync(file, `module.exports = ${JSON.stringify(result, null, '\t')};`, 'utf8');
        fs.writeFileSync(mapFile, JSON.stringify(map, null, '\t'), 'utf8');
        spinner.succeed('翻译完成'.green);
    } else {
        spinner.fail('翻译错误，请勿输入不正确的code'.red);
    }
};