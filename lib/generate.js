require('colors');
const path = require('path');
const fs = require('fs');
const Utils = require('../lib/utils');
const FileProcess = require('./fileProcess');
let [messages, rootPath, i18nPath, i18nFile] = [];

/**
 * 读取原有的国际化信息放到messages中
 */
const readMessages = () => {
  let i18nFilePath = path.join(i18nPath, i18nFile);
  if (fs.existsSync(i18nFilePath)) {
    messages = require(i18nFilePath);
  } else {
    messages = {};
  }
};

/**
 * 将国际化信息放到国际化资源文件中，同时对已有的其他国际化文件进行更新，方便翻译
 */
const writeMessages = () => {
  if (!fs.existsSync(i18nPath)) {
    Utils.mkdirs(i18nPath);
  }
  let i18nFilePath = path.join(i18nPath, i18nFile);
  try {
    fs.readdirSync(i18nPath).forEach(file => {
      file = path.join(i18nPath, file);
      if (file !== i18nFilePath) {
        let oldMessages = require(file);
        fs.writeFileSync(file, `module.exports = ${JSON.stringify(Object.assign({}, messages, oldMessages), null, '\t')};`, 'utf8');
      }
    });
  } catch (e) {
  }
  fs.writeFileSync(i18nFilePath, `module.exports = ${JSON.stringify(messages, null, '\t')};`, 'utf8');
};

const generateVueFile = (file) => {
  let processFile = path.relative(process.cwd(), file);
  // if(processFile !== 'src/modules/ProjectConfigs/modules/ManageProject/index.vue'){
  //   return false;
  // }
  // console.log(`➤ ${processFile.yellow}`.blue);
  let content = fs.readFileSync(file, 'utf8');
  //获取模板部分
  let [, templateContent = ''] = content.match(/<template[^>]*>((.|\n)*)<\/template>/im) || [];
  FileProcess.generateTemplate(messages, templateContent);
  // //获取script部分
  let [, scriptContent = ''] = content.match(/<script[^>]*>((.|\n)*)<\/script>/im) || [];
  FileProcess.generateScript(messages, scriptContent);
  // console.log(`✔ ${processFile.yellow}`.green);
};
const generateJsFile = (file) => {
  let processFile = path.relative(process.cwd(), file);
  // console.log(`➤ ${processFile.yellow}`.blue);
  let content = fs.readFileSync(file, 'utf8');
  FileProcess.generateScript(messages, content);
  // console.log(`✔ ${processFile.yellow}`.green);
};

module.exports = function (src, {filepath, filename}) {
  rootPath = path.join(process.cwd(), src);
  i18nFile = `${filename}.js`;
  i18nPath = path.join(process.cwd(), filepath);
  readMessages();
  Utils.getAllFiles(rootPath).forEach(file => {
    if (file.indexOf(i18nPath) < 0) {
      path.extname(file) === '.vue' ? generateVueFile(file) : generateJsFile(file);
    }
  });
  writeMessages();
  console.log('✔ 中文资源文件文件都已生成完毕'.green, path.join(i18nPath, i18nFile).blue);
};
