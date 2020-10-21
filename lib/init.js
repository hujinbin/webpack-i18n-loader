require('colors');
const path = require('path');
const fs = require('fs');
const Utils = require('../lib/utils');
const {config_file,config} = require('./const');

module.exports = function () {
    fs.writeFile(config_file,`module.exports = ${JSON.stringify(config,null, '\t')};`,'utf8',function(error){
        if(error){
            console.log(error.red);
            return false;
        }
        console.log('初始化文件成功'.green);
    })    
};