import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 导入 FileProcess 模块
const FileProcess = require('./lib/fileProcess');

let messages = null; // 语言包对象
let vue = 0; // vue版本 0为未获取到，默认2版本
let config = {}; // 配置对象

const replaceTemplateContent = (content) => {
  return FileProcess.generateTemplate(messages, content, true);
};

const replaceScriptContent = (content) => {
  return FileProcess.generateScript(messages, content, true, Number(vue));
};

// 获取当前项目的vue版本
const getVueVersion = () => {
  const packageFile = path.join(process.cwd(), 'package.json');
  let packageInfo = {};
  
  if (fs.existsSync(packageFile)) {
    try {
      const packageContent = fs.readFileSync(packageFile, 'utf8');
      packageInfo = JSON.parse(packageContent);
    } catch (e) {
      console.error('Error reading package.json:', e);
      return 2;
    }
  }
  
  // 获取当前vue版本，默认 2
  const vueVersion = packageInfo.dependencies?.vue || packageInfo.devDependencies?.vue;
  
  if (!vueVersion) {
    vue = 2;
    return vue;
  }
  
  try {
    const firstVersion = String(vueVersion).split('.')[0];
    const vueArr = String(firstVersion).match(/\d+/g);
    vue = vueArr ? Number(vueArr.join('')) : 2;
  } catch (e) {
    vue = 2;
  }
  
  return vue;
};

// 初始化配置
const initConfig = () => {
  const configFile = path.join(process.cwd(), 'i18n-config.js');
  
  if (fs.existsSync(configFile)) {
    try {
      // 读取配置文件内容
      const configContent = fs.readFileSync(configFile, 'utf8');
      
      // 提取配置对象
      const objectMatch = configContent.match(/module\.exports\s*=\s*(\{[\s\S]*?\});?$/m);
      if (objectMatch) {
        // 使用 Function constructor 安全执行
        const func = new Function('return ' + objectMatch[1]);
        return func();
      }
      
      return {
        dir: './src/locale/',
        file: 'zh.js',
        open: true
      };
    } catch (error) {
      console.error('Error loading i18n-config.js:', error);
      return {
        dir: './src/locale/',
        file: 'zh.js',
        open: true
      };
    }
  } else {
    return {
      dir: './src/locale/',
      file: 'zh.js',
      open: true
    };
  }
};

// 初始化语言包
const initMessages = (localeFile) => {
  if (!messages && fs.existsSync(localeFile)) {
    try {
      // 清除require缓存
      delete require.cache[require.resolve(localeFile)];
      
      // 对于不同文件类型需要特殊处理
      if (localeFile.endsWith('.ts')) {
        const messagesContent = fs.readFileSync(localeFile, 'utf8');
        // 提取导出的对象
        const objectMatch = messagesContent.match(/const\s+\w+\s*=\s*(\{[\s\S]*?\});/);
        if (objectMatch) {
          // 使用 Function constructor 替代 eval
          const func = new Function('return ' + objectMatch[1]);
          messages = func();
        } else {
          messages = {};
        }
      } else if (localeFile.endsWith('.cjs') || localeFile.endsWith('.js')) {
        // 对于 CommonJS 文件使用 require
        messages = require(localeFile);
      } else {
        messages = {};
      }
      
      // 在开发环境监听文件变化
      if (process.env.NODE_ENV !== 'production') {
        fs.watchFile(localeFile, { interval: 1000 }, () => {
          delete require.cache[require.resolve(localeFile)];
          messages = null;
        });
      }
    } catch (e) {
      // 如果require失败，尝试解析文件内容
      try {
        const messagesContent = fs.readFileSync(localeFile, 'utf8');
        const startIndex = messagesContent.indexOf('{');
        const endIndex = messagesContent.lastIndexOf('}');
        if (startIndex !== -1 && endIndex !== -1) {
          const configString = messagesContent.slice(startIndex, endIndex + 1);
          // 使用 Function constructor 替代 eval
          const func = new Function('return ' + configString);
          messages = func();
        } else {
          messages = {};
        }
      } catch (parseError) {
        console.error('Error parsing locale file:', parseError);
        messages = {};
      }
    }
  }
};

// Vite 插件 - ES Module 版本
function vitePluginI18n(options = {}) {
  let isConfigured = false;
  
  return {
    name: 'vite-plugin-i18n',
    
    configResolved(resolvedConfig) {
      // 在配置解析后初始化
      if (!isConfigured) {
        // 初始化配置
        config = initConfig();
        
        // 获取Vue版本
        if (vue === 0) {
          getVueVersion();
        }
        
        isConfigured = true;
      }
    },
    
    configureServer(server) {
      // 开发服务器启动时的配置
      server.middlewares.use('/api/i18n-reload', (req, res, next) => {
        // 提供一个API来重新加载语言包和配置
        messages = null;
        isConfigured = false;
        res.end('Language pack reloaded');
      });
    },
    
    async transform(code, id) {
      // 不处理node_modules文件
      if (id.includes('node_modules')) {
        return null;
      }
      
      // 检查插件是否启用
      if (config.open === false && process.env.NODE_ENV !== 'production') {
        return null;
      }
      
      // 确定语言包文件路径
      let localeFile = path.resolve(process.cwd(), 'src/locale/zh.js');
      if (config.dir && config.file) {
        localeFile = path.resolve(process.cwd(), config.dir, config.file);
      }
      
      // 如果找不到指定文件，尝试查找其他格式
      if (!fs.existsSync(localeFile)) {
        const basePath = localeFile.replace(/\.(js|ts|cjs)$/, '');
        const extensions = ['.cjs', '.ts', '.js'];
        
        for (const ext of extensions) {
          const testFile = basePath + ext;
          if (fs.existsSync(testFile)) {
            localeFile = testFile;
            break;
          }
        }
      }
      
      // 初始化语言包
      initMessages(localeFile);
      
      if (!messages) {
        return null;
      }
      
      // 排除语言包目录下的文件
      const localeDir = path.dirname(localeFile);
      if (id.startsWith(localeDir)) {
        return null;
      }
      
      const fileSuffix = path.extname(id);
      let result = code;
      
      try {
        if (['.js', '.jsx', '.ts', '.tsx'].includes(fileSuffix)) {
          // 处理 JavaScript/TypeScript 文件
          result = replaceScriptContent(code);
        } else if (fileSuffix === '.vue') {
          // 处理 Vue 单文件组件
          result = code.replace(/(<template[^>]*>)((.|\n|\r)*)(<\/template>)/gim, (_, preTag, content, $3, afterTag) => {
            return `${preTag}${replaceTemplateContent(content)}${afterTag}`;
          });
          
          result = result.replace(/(<script[^>]*>)((.|\n|\r)*)(<\/script>)/gim, (_, preTag, content, $3, afterTag) => {
            return `${preTag}${replaceScriptContent(content)}${afterTag}`;
          });
        }
        
        // 如果内容有变化，返回转换结果
        if (result !== code) {
          return {
            code: result,
            map: null
          };
        }
      } catch (error) {
        console.error('Error transforming file:', id, error);
      }
      
      return null;
    },
    
    handleHotUpdate(ctx) {
      // 热更新处理
      const localeFile = path.resolve(process.cwd(), config.dir || './src/locale/', config.file || 'zh.js');
      
      if (ctx.file === localeFile) {
        // 语言包文件变化时，清除缓存
        messages = null;
        console.log('Language pack updated, clearing cache...');
        return [];
      }
    }
  };
}

export { vitePluginI18n };