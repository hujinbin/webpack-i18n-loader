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
const initMessages = ({localeFile}) => {
  //如果资源数据不存在，但资源文件存在，则将资源文件载入到资源数据中
  if (!messages && fs.existsSync(localeFile)) {
    messages = require(localeFile);
    //文件变化监听
    fs.watchFile(localeFile, {
      interval: 1000
    }, _ => {
      //删除require缓存并置空，等待下一次的载入
      delete require.cache[require.resolve(localeFile)];
      messages = null;
    });
  }
};

module.exports = function (source) {
  let options = loaderUtils.getOptions(this);
  options = Object.assign({
    localeFile: path.join(process.cwd(), 'src/locale/zh_cn.js')
  }, options);
  initMessages(options);
  if (!messages) return source;
  let result = '';
  if (path.extname(this.resourcePath) === '.js' && this.resourcePath.indexOf(path.parse(options.localeFile).dir) < 0) {
    //处理js文件
    result = replaceScriptContent(source);
  } else if (path.extname(this.resourcePath) === '.vue') {
    //处理vue文件
    let query = loaderUtils.parseQuery(this.resourceQuery || '?');
    if (query.type === 'script' && query.lang === 'js') {
      result = replaceScriptContent(source);
    } else {
      result = source.replace(/(<template[^>]*>)((.|\n)*)(<\/template>)/gim, (_, preTag, content, $3, afterTag) => {
        return `${preTag}${replaceTemplateContent(content)}${afterTag}`;
      });
      result = result.replace(/(<script[^>]*>)((.|\n)*)(<\/script>)/gim, (_, preTag, content, $3, afterTag) => {
        return `${preTag}${replaceScriptContent(content)}${afterTag}`;
      });
    }
  } else {
    result = source;
  }
  return result;
};
