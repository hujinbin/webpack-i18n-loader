require('colors');
const path = require('path');
const fs = require('fs');
const request = require('request');
const ora = require('ora');
const Utils = require('../lib/utils');
const {
    config_file
} = require('./const');

let map = {} // 遍历映射中英文对象
let result = {}; // map 中英文对照表，result 翻译结果
let fromData = {}; // 需要翻译的中文包
let config = {} // 项目配置文件

const translate = (val,keyList) => {
    const appid = config.appId;
    const key = config.secret;
    const salt = (new Date).getTime(); //取当前时间作为随机数
    const query = val; // 需要搜索的值
    const q = encodeURIComponent(query); //编码UTF-8
    const from = 'auto'; //原文
    const to = 'en'; //译文
    const str1 = appid + query + salt + key; //秘钥
    const sign = Utils.Md5(str1); //md5加密
    return new Promise(function(resolve, reject){
            request({
                url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
                qs: {
                    q: query,
                    appid: appid,
                    salt: salt,
                    from: 'auto',
                    to: 'en',
                    sign: sign
                },
                method: 'GET'
            }, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    const data = JSON.parse(body)
                    if(data.error_code){
                        console.log('百度翻译未成功翻译'.red)
                        console.log(data)
                    }else{
                        const trans_result = data.trans_result
                        trans_result.forEach((item,index)=>{
                            map[item.src] = item.dst
                            result[keyList[index]] = item.dst
                        })
                    }
                    setTimeout(()=>{
                        resolve();
                    },1500)
                }
            });
    })
}

module.exports = async function () {
    let processFile = ''
    if (fs.existsSync(config_file)) {
        processFile = path.join(process.cwd(), config_file);
        config = require(processFile);
    }else{
        console.error(`${config_file}文件不存在，请先初始化项目`.red);
        return;
    }
    if (fs.existsSync(config.dir+config.file)) {
        processFile = path.join(process.cwd(), config.dir+config.file);
        fromData = require(processFile)
    }else{
        console.error(`需要翻译的文件不存在,${config.dir+config.file}`.red);
        return;
    }
    const spinner = ora("正在翻译中，请稍后......".blue);
    spinner.start();
    let query = ''
    let keyList = []
    const fromDataArray=Object.keys(fromData)
    for(let i = 0;i<=fromDataArray.length;i++){
        const key = fromDataArray[i]
        if(query.length>=1500){
            await translate(query,keyList);
            query = fromData[key]
            keyList = [key]
        }else{
            query+='\n'+fromData[key]
            keyList.push(key)
            if(i === fromDataArray.length){
               await translate(query,keyList);
            }
        }
    }
    const file = path.join(process.cwd(), config.dir+'en.js');
    const mapFile = path.join(process.cwd(), config.dir+'en.js.map');
    fs.writeFileSync(file, `module.exports = ${JSON.stringify(Object.assign({}, result, result), null, '\t')};`, 'utf8');
    fs.writeFileSync(mapFile, JSON.stringify(map, null, '\t'), 'utf8');
    spinner.succeed('翻译完成'.green);
};