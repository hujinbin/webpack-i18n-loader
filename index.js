const loaderUtils = require('loader-utils');
const path = require('path');
const fs = require('fs');
const FileProcess = require('./lib/fileProcess');
let messages = null; // 语言包对象
let vue = 0 //vue版本 0为未获取到，默认2版本
const replaceTemplateContent = (content) => {
  return FileProcess.generateTemplate(messages, content, true);
};
const replaceScriptContent = (content) => {
  return FileProcess.generateScript(messages, content, true, Number(vue));
};
const initMessages = ({
  localeFile
}) => {
  //如果资源数据不存在，但资源文件存在，则将资源文件载入到资源数据中
  if (!messages && fs.existsSync(localeFile)) {
    messages = require(localeFile);
    //文件变化监听
    const isProduction = process.env.NODE_ENV === 'production'
    if (!isProduction) {
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

// 获取当前项目的vue版本
const getVueVersion = () => {
  // 获取vue版本号
  const packageFile = path.join(process.cwd(), 'package.json');
  let package = {};
  // 获取当前项目的package.json信息
  if (fs.existsSync(packageFile)) {
    package = require(packageFile);
  }
  console.log("/n ===============")
  // 获取当前vue版本，默认 2
  const vueVersion = package.dependencies.vue || package.devDependencies.vue;
  console.log(vueVersion)
  try {
    const firstVersion = String(vueVersion).split('.')[0];
    const vueArr = String(firstVersion).match(/\d+/g);
    vue = vueArr.join('')
    console.log("vue================")
    console.log(vue)
  } catch (e) {
    vue = 2;
  }
}

async function webpackLoader(source) {
  if (state === false) {
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
  if (config.open === false && process.env.NODE_ENV !== 'production') {
    return source
  }
  let options = loaderUtils.getOptions(this);
  options = Object.assign({
    localeFile: path.join(process.cwd(), 'src/locale/zh.js')
  }, options);
  initMessages(options);
  if (!messages) return source;

  if (vue === 0) { // 只执行一次
    getVueVersion();
  }

  let result = '';
  if (this.resourcePath.indexOf('node_modules') > -1) {
    return source
  }
  const fileSuffix = path.extname(this.resourcePath)
  if (['.js', '.jsx', '.ts', '.tsx'].includes(fileSuffix)
    && this.resourcePath.indexOf(path.parse(options.localeFile).dir) < 0) {
    //处理js文件
    result = replaceScriptContent(source);
  } else if (fileSuffix === '.vue') {
    //处理vue文件
    result = source.replace(/(<template[^>]*>)((.|\n|\r)*)(<\/template>)/gim, (_, preTag, content, $3, afterTag) => {
      return `${preTag}${replaceTemplateContent(content)}${afterTag}`;
    });
    result = result.replace(/(<script[^>]*>)((.|\n|\r)*)(<\/script>)/gim, (_, preTag, content, $3, afterTag) => {
      return `${preTag}${replaceScriptContent(content)}${afterTag}`;
    });
  } else {
    result = source;
  }
  return result;
};

const initViteMessages = (localeFile) => {
  //如果资源数据不存在，但资源文件存在，则将资源文件载入到资源数据中
  if (!messages && fs.existsSync(localeFile)) {
    const messagesContent = fs.readFileSync(localeFile, 'utf8');
    try {
      const startIndex = messagesContent.indexOf('{');
      const endIndex = messagesContent.lastIndexOf('}');
      const configString = messagesContent.slice(startIndex, endIndex + 1);
      // 解析为对象
      messages = eval('(' + configString + ')');
    } catch (e) {
      messages = {}
    }
  }
};

// vite插件
function vitePluginI18n() {
  return {
    name: 'vite-plugin-i18n',
    configureServer(server) {
      const configFilePath = path.join(process.cwd(), 'i18n-config.js');
      try {
        const fileContent = fs.readFileSync(configFilePath, 'utf8');
        // 提取配置对象部分
        const startIndex = fileContent.indexOf('{');
        const endIndex = fileContent.lastIndexOf('}');
        const configString = fileContent.slice(startIndex, endIndex + 1);
        // 解析为对象
        config = eval('(' + configString + ')');
      } catch (error) {
        console.error('Error reading or parsing i18n-config.js:', error);
        config = {}
      }
    },
    async transform(code, id) {
      try {
        // 不在打包环境下生效
        if (config.open === false && process.env.NODE_ENV !== 'production') {
          return {
            code: code,
            map: null,
          }
        }
        
        // 跳过 node_modules 文件
        if (id.indexOf('node_modules') > -1) {
          return {
            code: code,
            map: null,
          }
        }
        
        // 获取语言包文件路径
        const dir = config.dir;
        const file = config.file;
        let localeFile = path.join(process.cwd(), 'src/locale/zh.js')
        if (dir && file) {
          localeFile = path.join(process.cwd(), dir + file);
        }

        // 初始化语言包
        initViteMessages(localeFile);
        if (!messages) {
          return {
            code: code,
            map: null,
          }
        }
        
        // 获取Vue版本
        if (vue === 0) {
          getVueVersion();
        }

        // 检查文件是否在语言包目录内，如果是则跳过处理
        const relativePath = path.relative(path.parse(localeFile).dir, id);
        if (!relativePath.startsWith('..')
          && !path.isAbsolute(relativePath)) {
          return {
            code: code,
            map: null,
          }
        }
        
        const fileSuffix = path.extname(id);
        let result = '';

        if (['.js', '.jsx', '.ts', '.tsx'].includes(fileSuffix)) {
          // 处理 JavaScript/TypeScript 文件
          result = replaceScriptContent(code);
        } else if (fileSuffix === '.vue') {
          // 处理 Vue 单文件组件
          result = code;
          
          // 处理 template 部分
          result = result.replace(/(<template[^>]*>)((.|\n|\r)*)(<\/template>)/gim, (_, preTag, content, $3, afterTag) => {
            const transformedContent = replaceTemplateContent(content);
            return `${preTag}${transformedContent}${afterTag}`;
          });
          
          // 处理 script 部分
          result = result.replace(/(<script[^>]*>)((.|\n|\r)*)(<\/script>)/gim, (_, preTag, content, $3, afterTag) => {
            const transformedContent = replaceScriptContent(content);
            return `${preTag}${transformedContent}${afterTag}`;
          });
        } else {
          // 其他文件类型不处理
          result = code;
        }
        
        return {
          code: result,
          map: null,
        }
      } catch (error) {
        // 错误处理，返回原始代码
        console.error('Vite i18n transform error:', error);
        return {
          code: code,
          map: null,
        }
      }
    }
  }
}


// 条件导出
module.exports = webpackLoader;
module.exports.vitePluginI18n = vitePluginI18n;