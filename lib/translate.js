require('colors');
const path = require('path');
const fs = require('fs');
const request=require('request');
const Utils = require('../lib/utils');

let map = {}
let result = {};  // map 中英文对照表，result 翻译结果

const translate = () =>{
    var appid = '20201016000590904';
    var key = '5yieziCAayrmv2cX8eN3';
    var salt = (new Date).getTime(); //取当前时间作为随机数
    var query = '江苏的南京烦恼'; // 需要搜索的值
    var q = encodeURIComponent(query); //编码UTF-8
    var from = 'auto'; //原文
    var to = 'en'; //译文
    var str1 = appid + query + salt + key; //秘钥
    var sign = Utils.Md5(str1); //md5加密

    request(
        {
            url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
        // url: `https://fanyi-api.baidu.com/api/trans/vip/translate
        // ?q=${query}&appid=&${appid}&salt=${salt}&from=auto&to=en&sign=${sign}`, // 百度翻译接口地址
        //请求参数，对象
        qs: {
            q: query,
            appid: appid,
            salt: salt,
            from: 'auto',
            to: 'en',
            sign: sign
        },
        method:'GET'
    },(error,response,body)=>{
        if(!error && response.statusCode==200){
            const data = JSON.parse(body)
            const trans_result = data.trans_result[0]
            console.log(data.trans_result)
            map[trans_result.src]=trans_result.dst
            console.log(map);
        }
    });
}



module.exports = function () {
    translate();
    console.log('翻译完成'.green)
};