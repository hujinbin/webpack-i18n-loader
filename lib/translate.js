require('colors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const ora = require('ora');
const Utils = require('../lib/utils');
const {
    config_file,
    languages,
} = require('./const');

let map = {} // 遍历映射中英文对象
let result = {}; // map 中英文对照表，result 翻译结果
let fromData = {}; // 需要翻译的中文包
let config = {} // 项目配置文件
let toCode = '' //要翻译的语言
let OPENAI_API_KEY = '' // chatGPT key
let translateNum = 0; // 分段翻译时的翻译数
let totalTranslateNum = 0; // 本次语言翻译的总个数

const {
    Configuration,
    OpenAIApi
} = require('openai') // chatGPT


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// gpt翻译
const gptTranslate = async (chatGPTData) => {
    const configuration = new Configuration({
        apiKey: OPENAI_API_KEY
    })
    const openai = new OpenAIApi(configuration)
    const lang = languages[toCode] || toCode
    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                {"role": "system", "content": "你是一个善于翻译的人工智能助手."},
                {"role": "user","content": `I want you to act as an ${lang} translator. 
                Your translated content will be applied on the user interface of the software. 
                I will push a json object in any language and you will detect the json value language, 
                translate json value in ${lang}, ignore json key. Keep the meaning the same, 
                but be as concise as possible. return only json content, 
                the return json not allow trailing commas.
                 My first json is ${JSON.stringify(chatGPTData)}`}
            ],
        })
        let choice = response.data.choices[0].message.content;
        const startIndex = choice.indexOf("{");
        const endIndex = choice.lastIndexOf("}");
        choice = choice.slice(startIndex, endIndex + 1);
        const trans_result = JSON.parse(choice)
        Object.keys(chatGPTData).forEach((key) => {
            const src = chatGPTData[key] || '' //原文
            let dst = trans_result[key] || '' // 译文
            if (dst !== '' && src!=='') {
                if (toCode === 'en') {
                    dst = Utils.replaceStr(src, dst)
                }
                map[src] = dst
                result[key] = dst
                translateNum++;
            }
        })
        console.log(`\n${toCode}语言翻译进度：${translateNum}/${totalTranslateNum}`)
        await sleep(3000);
        return true;
    } catch (error) {
        console.log('\n')
        console.log('X chatGPT翻译中断'.red)
        console.log(error.message);
        return false;
    }
}


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
                        if (toCode === 'en') {
                            let dst = Utils.replaceStr(item.src, item.dst)
                            map[item.src] = dst
                            result[keyList[index]] = dst
                        } else {
                            map[item.src] = item.dst
                            result[keyList[index]] = item.dst
                        }
                        translateNum++;
                    })
                    console.log(`\n${toCode}语言翻译进度：${translateNum}/${totalTranslateNum}`)
                }
                setTimeout(() => {
                    if (data.error_code) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                }, 1500)
            }
        }).catch((err) => {
            reject(err)
            console.log('X 百度翻译出现网络错误\n'.red)
        })
    })
}

module.exports = async function (code, filename) {
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

    // 读取需要翻译的中文文件
    if (fs.existsSync(config.dir + file)) {
        processFile = path.join(process.cwd(), config.dir + file);
        fromData = require(processFile)
    } else {
        spinner.fail(`需要翻译的文件不存在,${config.dir+file}\n`.red);
        return;
    }
    let distLangs = config.distLangs || [];
    if (
        !distLangs.includes(code) && // 指令的code 不包含在 distLangs配置项内
        file !== code + '.js' // 翻译的文件语种 和 翻译目标语种不同
    ) {
        distLangs.unshift(code)
    }
    const distLangsLength = distLangs.length;
    let singleNum = config.singleNum || 1500 // 百度翻译 单次请求最长次数
    singleNum = Number(singleNum)
    singleNum = singleNum > 3900 ? 3900 : singleNum
    singleNum = singleNum < 600 ? 600 : singleNum
    const mode = config.mode || 'Baidu' // 翻译方式    
    OPENAI_API_KEY = config.openAiKey // chatGPT key
    for (let i = 0; i < distLangsLength; i++) {
        translateNum = 0;
        spinner.start();
        toCode = distLangs[i]
        // 获取需要翻译文件的位置
        let filePath = config.dir + toCode
        if (filename) {
            file = filename.indexOf('.') > -1 ? filename : `${filename}.js`
            const pointLocation = file.indexOf('.');
            const toCodeName = file.substr(0, pointLocation);
            filePath = config.dir + toCode + '-' + toCodeName
        }
        // 已有翻译的数据
        let oldData = {}
        if (fs.existsSync(filePath + '.js')) {
            processFile = path.join(process.cwd(), filePath + '.js');
            oldData = require(processFile)
            result = oldData;
        }
        let query = '' // 需要翻译的文字拼接
        let translateState = true; // 翻译成功与否的状态
        let keyList = []
        const oldDataArray = Object.keys(oldData)
        // 通过对比中文json和英文josn，取出未翻译的中文 数组
        const fromDataArray = Object.keys(fromData).filter(val => {
            return oldDataArray.indexOf(val) === -1
        })
        oldDataArray.forEach((key) => {
            map[fromData[key]] = oldData[key] //填充已有的map文件
        })
        totalTranslateNum = fromDataArray.length // 需要翻译的语言数量
        let chatGPTData = {} // 本次翻译的原文 {key:val}
        for (let i = 0; i < totalTranslateNum; i++) {
            const key = fromDataArray[i]
            if (translateState) {
                if (mode === 'chatGPT') { //chatGPT翻译
                    if (String(query).length >= 600) {
                        translateState = await gptTranslate(chatGPTData);
                        query = fromData[key]
                        chatGPTData = {
                            key: query
                        }
                    } else {
                        if (i === 0) {
                            query = fromData[key]
                        } else {
                            query += ('\n' + fromData[key])
                        }
                        chatGPTData[key] = fromData[key]
                        if (i === totalTranslateNum - 1) {
                            translateState = await gptTranslate(chatGPTData);
                        }
                    }
                } else { // 百度翻译
                    if (String(query).length >= singleNum) {
                        translateState = await translate(query, keyList);
                        query = fromData[key]
                        keyList = [key]
                    } else {
                        query += ('\n' + fromData[key])
                        keyList.push(key)
                        if (i === totalTranslateNum - 1) {
                            translateState = await translate(query, keyList);
                        }
                    }
                }
            }
        }
        if (translateState || translateNum > 0) { // translateState 翻译成功写入文件 || translateNum > 0 ：分段翻译出现部分失败
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
            if (translateState && totalTranslateNum === translateNum) {
                spinner.succeed(`${toCode}语言已翻译完成,本次翻译个数：${translateNum}`.green);
            } else {
                const unCompletedNum = totalTranslateNum - translateNum;
                spinner.succeed(`${toCode}语言已翻译个数：${translateNum},未完成翻译个数：${unCompletedNum}`.green);
            }
        } else {
            spinner.fail('翻译错误，请勿输入不正确的code'.red);
        }
    }
};