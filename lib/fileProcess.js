const Utils = require('./utils');
const zhReg = /^([\u4e00-\u9fa5]|[a-zA-Z])+$/; // 中英文正则
/**
 * 用来替换包含中文的语句，包括普通字符串和模板字符串
 * @param needReplace
 * @param messages
 * @param statement
 * @param pSign
 * @return {{hasReplace: *, content: *}}
 */
const replaceStatement = (needReplace, messages, statement, pSign = '\'') => {
  let hasReplace = false;
  //替换所有包含中文的模板字符串
  statement = statement.replace(/(`)(((?!\1).)*[\u4e00-\u9fa5]+((?!\1).)*)\1/gm, (_, sign, value) => {
    //先对内部的 ${} 中的内容进行参数传参替换
    let [matchIndex, matchArr] = [0, []];
    value = value.replace(/\${([^}]+)(})/gm, (_, value) => {
      matchArr.push(value);
      return `{${matchIndex++}}`;
    });
    let key = Utils.Md5_16(value);
    //如果需要替换，且无对应替换值，则直接返回
    if (needReplace && !messages[key]) {
      return _;
    }!needReplace && !messages[key] && (/.*[\u4e00-\u9fa5]+.*$/.test(value)) && (messages[key] = value);
    hasReplace = true;
    let cSign = pSign === '"' ? '\'' : '"';
    if (!matchArr.length) {
      return `$t(${cSign}${key}${cSign}')`;
    } else {
      return `$t(${cSign}${key}${cSign},[${matchArr.toString()}])`;
    }
  });
  //替换\' \"
  statement = statement.replace(/\\'/g, '&sbquo;').replace(/\\"/g, '&quot;');
  //替换所有包含中文的普通字符串
  statement = statement.replace(/(['"])(((?!\1).)*[\u4e00-\u9fa5]+((?!\1).)*)\1/gm, (_, sign, value) => {
    //将\' \"替换回来
    // value = value.replace(/&sbquo;/g, '\'').replace(/&quot;/g, '\"');
    // 清除两端空格
    value = Utils.trim(value)
    let key = Utils.Md5_16(value);
    //如果需要替换，且无对应替换值，则直接返回
    if (needReplace && !messages[key]) {
      return _;
    }!needReplace && !messages[key] && (/.*[\u4e00-\u9fa5]+.*$/.test(value)) && (messages[key] = value);
    hasReplace = true;
    return `$t(${sign}${key}${sign})`;
  });
  //替换所有js内jsx语法普通字符串
  statement = statement.replace(/(>)([^><]*[\u4e00-\u9fa5]+[^><]*)(<)/gm, (_, sign, value) => {
    // value = value.replace(/>/g, "'").replace(/</g, "'");
    // 清除两端空格
    value = Utils.trim(value)
    let key = Utils.Md5_16(value);
    //如果需要替换，且无对应替换值，则直接返回
    if (needReplace && !messages[key]) {
      return _;
    }!needReplace && !messages[key] && (/.*[\u4e00-\u9fa5]+.*$/.test(value)) && (messages[key] = value);
    hasReplace = true;
    return `>{$t("${key}")}<`;
  });
  return {
    content: statement,
    hasReplace
  };
};

/**
 * 导入模块的正则
 * @param moduleName
 * @return {RegExp}
 */
const generateImportModuleTestReg = (moduleName) => {
  return new RegExp(`import[\\s\\t]+([^\\s\\t]+)[^'"]+["']${moduleName}['"]|(const|let|var)[\\s\\t]+([^\\s\\t]+)[^'"]+['"]${moduleName}['"]`, 'im');
};

/**
 * JS部分需要注入实例
 * @param content
 * @return {string}
 */
const injectInstance = (content) => {
  let importContent = '';
  let injectContent = '';
  //判断是否注入vue
  let matchVue = content.match(generateImportModuleTestReg('vue'));
  let moduleVue = 'Vue';
  if (!matchVue) {
    importContent = `${importContent}import Vue from 'vue';\n`;
  } else {
    moduleVue = matchVue[1] || matchVue[3];
  }

  //若未绑定 $t ，则进行绑定
  if (content.indexOf('const $t = i18n.t.bind(i18n)') < 0) {
    injectContent = `${injectContent}
    import i18n from '@/i18n';
    const $t = i18n.t.bind(i18n);
`;
    // injectContent = `${injectContent}
    // let _i18n_vue = new ${moduleVue}();
    // const $t = _i18n_vue.$t.bind(_i18n_vue);`;
  }

  //将引入模块的内容放到内容区的最前面
  content = `${importContent}${content}`;
  let [lastImport] = content.match(/import(?!from).+from(?!from).+;?/gm).reverse();
  content = content.replace(lastImport, match => {
    return `
    ${match}\n
    ${injectContent}
    `;
  });
  return content;
};

/**
 * 生成模板部分
 * @param messages
 * @param content
 * @param needReplace
 * @return {string}
 */
exports.generateTemplate = (messages, content, needReplace) => {
  // 忽略不需要替换中文的抓取
  let ignores = {};
  let ignoreIndex = 0;
  // 替换忽略的部分
  content = content.replace(/<!--\s*i18n-ignore(.|\s)*-->/gim, (match, p1, p2, p3, offset, str) => {
    //排除掉url协议部分
    if (match.indexOf("<!-- ignore_") > -1) return match;
    if (offset > 0 && str[offset - 1] === ':') return match;
    let ignoresKey = `<!-- ignore_${ignoreIndex++} -->`;
    ignores[ignoresKey] = match;
    return ignoresKey;
  });
  //匹配查找tag中的属性并进行替换包含中文属性的部分
  content = content.replace(/(<[^\/\s]+)([^<>]+)(\/?>)/gm, (_, tag, attrs, endTag) => {
    //提取包含中文属性值的属性并进行替换
    attrs = attrs.replace(/([^\s]+)=(["'])(((?!\2).)*[\u4e00-\u9fa5]+((?!\2).)*)\2/gim, (_, attr, sign, value) => {
      if (attr.match(/^(v-|@)/) || 'class,style,src,href,width,height'.split(',').includes(attr.trim())) {
        //对于已经是v-开头的以及白名单内的属性，不进行替换
        return `${attr}=${sign}${value}${sign}`;
      }
      if (attr.indexOf(':') === 0) {
        //对所有:开头的属性替换为v-bind: 模式
        return `v-bind${attr}=${sign}${value}${sign}`;
      } else {
        //对所有的字符串属性替换为v-bind:模式
        if (!['true', 'false'].includes(value) && isNaN(value)) {
          value = sign === '"' ? `'${value}'` : `"${value}"`;
        }
        return `v-bind:${attr}=${sign}${value}${sign}`;
      }
    });
    //通过对v-bind属性中包含有中文的部分进行国际化替换
    attrs = attrs.replace(/(v-bind:[^=]+=)(['"])(((?!\2).)+[\u4e00-\u9fa5]+((?!\2).)+)\2/gim, (_, attr, sign, value) => {
      return `${attr}${sign}${replaceStatement(needReplace, messages, value, sign).content}${sign}`;
    });
    return `${tag}${attrs}${endTag}`;
  });
  //匹配查找标签内容（包含中文的）并进行替换
  content = content.replace(/(>)([^><]*[\u4e00-\u9fa5]+[^><]*)(<)/gm, (_, prevSign, value, afterSign) => {
    // 去除中间的所有空格和换行符号
    value = value.replace(/\s+/g, ""); ;
    //将所有不在 {{}} 内的内容，用 {{}} 包裹起来
    value = value.replace(/^((?!{{).)+/gm, value => {
      //前面部分
      return `{{${JSON.stringify(value)}}}`;
    });
    value = value.replace(/}}(((?!}}).)+)$/gm, (_, value) => {
      //后面部分
      return `}}{{${JSON.stringify(value)}}}`;
    });
    value = value.replace(/&gt;/g, ">").replace(/&lt;/g, "<");
    //对所有的{{}}内的内容进行国际化替换
    value = value.replace(/({{)(((?!\1|}}).)+)(}})/gm, (_, prevSign, value, $3, afterSign) => {
        return `${prevSign}${replaceStatement(needReplace, messages, value).content}${afterSign}`;
    });
    // 过滤未转化而且有英文等内容的
    value = value.replace(/({{")(((?!\1|}}).)+)("}})/gm, (_, prevSign, value, $3, afterSign) => {
      return value
    });
    // return value;
    return `${prevSign}${value}${afterSign}`;
  });
  //换回忽略部分
  content = content.replace(/<!-- ignore_\d+ -->/gim, match => {
    return ignores[match];
  });
  return content;
};

/**
 * 生成JS部分
 * @param messages
 * @param content
 * @param needReplace
 * @return {string}
 */
exports.generateScript = (messages, content, needReplace) => {
  // 忽略js的抓取
  let ignores = {};
  let ignoreIndex = 0;
  // 替换忽略的部分
  content = content.replace(/\<\s*i18n-ignore(.|\n|\r)+?\/\/\s*>/gim, (match, p1, p2, p3, offset, str) => {
    //排除掉url协议部分
    if (match.indexOf("/*ignore_") > -1) return match;
    if (offset > 0 && str[offset - 1] === ':') return match;
    let ignoresKey = `/*ignore_${ignoreIndex++}*/`;
    ignores[ignoresKey] = match;
    return ignoresKey;
  });
  //替换注释部分
  let comments = {};
  let commentsIndex = 0;
  let hasReplace = false;
  // ''
  // 过滤多行注释
  content = content.replace(/(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/gim, (match, p1, p2, p3, offset, str) => {
    //排除掉url协议部分
    if (offset > 0 && str[offset - 1] === ':') return match;
    let commentsKey = `/*comment_${commentsIndex++}*/`;
    comments[commentsKey] = match;
    return commentsKey;
  });
  // 注释单行
  content = content.replace(/(\/\*(.|\n|\r)*\*\/)|(\/\/.*)/gim, (match, p1, p2, p3, offset, str) => {
    //排除掉url协议部分
    if (match.indexOf("/*comment_") > -1) return match;
    if (offset > 0 && str[offset - 1] === ':') return match;
    let commentsKey = `/*comment_${commentsIndex++}*/`;
    comments[commentsKey] = match;
    return commentsKey;
  });
  //js内jsx语法  匹配查找tag中的属性并进行替换包含中文属性的部分
  content = content.replace(/(<[^\/\s]+)([^<>]+)(\/?>)/gm, (_, tag, attrs, endTag) => {
    //提取包含中文属性值的属性并进行替换
    attrs = attrs.replace(/([^\s]+)=(["'])(((?!\2).)*[\u4e00-\u9fa5]+((?!\2).)*)\2/gim, (_, attr, sign, value) => {
      if ('class,style,src,href,width,height'.split(',').includes(attr.trim())) {
        //排除css样式类，不进行替换
        return `${attr}=${sign}${value}${sign}`;
      }
      return `${attr}={${sign}${value}${sign}}`;
    });
    return `${tag}${attrs}${endTag}`;
  });
  //对包含中文的部分进行替换操作
  content = content.replace(/(['"`])(((?!\1).)*[\u4e00-\u9fa5]+((?!\1).)*)\1/gm, (value, prevSign, str, afterSign, p2, index) => {
    // 特殊中文处理 
    // 类型1
    // <sa-button type="text">更多<i class="sa-icon-arrow-down"></i></sa-button>
    // 这种类型的特殊处理 ">更多<i class="  
    const prevIndex = value.indexOf('>')
    const nextIndex = value.indexOf('<')
    let prev = '';
    let next = '';
    // 类型1处理
    if (prevIndex > -1 && nextIndex > -1 && nextIndex > prevIndex && value.indexOf('${') === -1) {
      // 过滤类型2  nextIndex > prevIndex 
      // <span style="color: #52C718">已激活</span>
      // 过滤类型类型3  value.indexOf('${') === -1
      // 当前已选中<span style="color: #008cfe; font-weight: bold;">${count}</span>个基础指标
      if (value.indexOf('${') === -1) {
        const index = prevIndex + 1
        prev = value.substr(0, index);
        next = value.substr(nextIndex, value.length - 1);
        value = value.substr(index, nextIndex - index);
        value = `"${value}"`
      }
    }
    let {
      hasReplace: replaced,
      content
    } = replaceStatement(needReplace, messages, value);
    hasReplace = hasReplace || replaced;
    if (prevIndex > -1 && nextIndex > -1 && nextIndex > prevIndex && value.indexOf('${') === -1) {
      // 类型1处理
      content = prev + '{' + content + "}" + next;
    }
    return content;
  });
  // 对js内jsx语法进行处理  匹配查找标签内容（包含中文的）并进行替换
  content = content.replace(/(>)([^><]*[\u4e00-\u9fa5]+[^><]*)(<)/gm, (_, prevSign, value, afterSign) => {
    const regValue = value.replace(/\s*/g, "")
    if (!zhReg.test(regValue)) {
      return prevSign + value + afterSign;
    }
    value = prevSign + value + afterSign;
    let {
      hasReplace: replaced,
      content
    } = replaceStatement(needReplace, messages, value);
    hasReplace = hasReplace || replaced;
    return content;
  });
  //换回注释部分
  content = content.replace(/\/\*comment_\d+\*\//gim, match => {
    return comments[match];
  });
  //换回忽略部分
  content = content.replace(/\/\*ignore_\d+\*\//gim, match => {
    return ignores[match];
  });

  //如果需要注入示例且已经有替换发生
  if (needReplace && hasReplace) {
    content = injectInstance(content);
  }
  return content;
};