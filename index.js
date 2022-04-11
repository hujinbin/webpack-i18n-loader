const loaderUtils = require('loader-utils');
const path = require('path');
const fs = require('fs');
const FileProcess = require('./lib/fileProcess');
let messages = null;
const replaceTemplateContent = (content) => {
  return FileProcess.generateTemplate(messages, content, true);
};
const replaceScriptContent = (content) => {
  return FileProcess.generateScript(messages, content, true);
};
const initMessages = ({
  localeFile
}) => {
  //如果资源数据不存在，但资源文件存在，则将资源文件载入到资源数据中
  if (!messages && fs.existsSync(localeFile)) {
    messages = require(localeFile);
    //文件变化监听
    const isProduction = process.env.NODE_ENV === 'production'
    if(!isProduction){
      fs.watchFile(localeFile, {
        interval: 1000
      }, _ => {
        //删除require缓存并置空，等待下一次的载入
        delete require.cache[require.resolve(localeFile)];
        messages = null;
      });
    }
  }
};

const {
  config_file
} = require('./lib/const');
let config = {}
let state = false // 读取配置状态 确保项目启动只读取一次
module.exports = function (source) {
  if(state === false){
    if (fs.existsSync(config_file)) {
      const processFile = path.join(process.cwd(), config_file);
      config = require(processFile);
    } 
    // else {
    //   return source
    // }
  }
  state = true
  // 不在打包环境下生效
  if(config.open === false && process.env.NODE_ENV !== 'production'){
    return source
  }
  let options = loaderUtils.getOptions(this);
  options = Object.assign({
    localeFile: path.join(process.cwd(), 'src/locale/zh_cn.js')
  }, options);
  initMessages(options);
  if (!messages) return source;
  // 获取vue版本号
  const packageFile = path.join(process.cwd(), 'package.json');
  let package = {};
    // 获取当前项目的package.json信息
  if (fs.existsSync(packageFile)) {
      package = require(packageFile);
  }
  console.log(package)
  // 版本和项目名
  // const {version, name} = package
  let result = '';
  if(this.resourcePath.indexOf('node_modules')>-1){
    return source
  }
  const fileSuffix = path.extname(this.resourcePath)
  if (['.js','.jsx', '.ts','.tsx'].includes(fileSuffix)
  && this.resourcePath.indexOf(path.parse(options.localeFile).dir) < 0) {
    //处理js文件
    result = replaceScriptContent(source);
  }else if (fileSuffix === '.vue') {
    //处理vue文件
    result = source.replace(/(<template[^>]*>)((.|\n)*)(<\/template>)/gim, (_, preTag, content, $3, afterTag) => {
      return `${preTag}${replaceTemplateContent(content)}${afterTag}`;
    });
    result = result.replace(/(<script[^>]*>)((.|\n)*)(<\/script>)/gim, (_, preTag, content, $3, afterTag) => {
      return `${preTag}${replaceScriptContent(content)}${afterTag}`;
    });
  } else {
    result = source;
  }
  return result;
};