const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * 创建深层目录
 * @param dirpath
 * @param mode
 */
exports.mkdirs = function (dirpath, mode) {
  mode = mode || '777';
  if (!fs.existsSync(dirpath)) {
    //尝试创建父目录，然后再创建当前目录
    exports.mkdirs(path.dirname(dirpath), mode);
    fs.mkdirSync(dirpath, mode);
  }
};

/**
 * 删除深层目录
 * @param dirpath
 */
exports.rmdirs = function (dirpath) {
  try {
    fs.readdirSync(dirpath).forEach(function (filepath) {
      var state = fs.statSync(path.join(dirpath, filepath));
      if (state.isDirectory()) {
        exports.rmdirs(path.join(dirpath, filepath));
      } else {
        fs.unlinkSync(path.join(dirpath, filepath));
      }
    });
    fs.rmdirSync(dirpath);
  } catch (e) {
    console.log(e);
  }
};

/**
 * 获取MD5值
 * @param str
 * @return {string}
 * @constructor
 */
exports.Md5 = function (str) {
  return crypto.createHash('md5').update(str).digest('hex');
};

//删除左右两端的空格
exports.trim = function (str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 获取16位的MD5值
 * @param str
 * @return {string}
 * @constructor
 */
exports.Md5_16 = function (str) {
  return exports.Md5(str).slice(8, 24);
};


/**
 * 获取指定目录下js和vue文件
 * @param dir
 * @return {[]}
 */
const getAllFiles = exports.getAllFiles = (dir) => {
  let results = [];
  fs.readdirSync(dir).forEach(item => {
    item = path.join(dir, item);
    if (fs.lstatSync(item).isDirectory()) {
      results.push(...getAllFiles(item));
    } else {
      if (['.vue', '.js'].indexOf(path.extname(item).toLowerCase()) > -1) {
        results.push(item);
      }
    }
  });
  return results;
};


// 英文大小写转化匹配规则
exports.replaceStr = function(str){ 
  let value = str
  // 全部转化
  // let arr = str.split(' ');
  //   console.log(arr);
  //   for(var i = 0;i<arr.length;i++){
  //       //将首字母大写 拼接后面没有首字母的部分
  //       arr[i]=arr[i].charAt(0).toUpperCase()+arr[i].slice(1);
  //   }
  //   value = arr.join(' ');
    // 单独首字母的转化
    value = str.substring(0,1).toUpperCase()+str.substring(1)
  return value
} 
/**
 * underscore 节流函数，返回函数连续调用时，func 执行频率限定为 次 / wait
 *
 * @param  {function}   func      回调函数
 * @param  {number}     wait      表示时间窗口的间隔
 * @param  {object}     options   如果想忽略开始函数的的调用，传入{leading: false}。
 *                                如果想忽略结尾函数的调用，传入{trailing: false}
 *                                两者不能共存，否则函数不能执行
 * @return {function}             返回调用函数
 */
exports.throttle = function (func, wait, options) {
  let context, args, result;
  let timeout = null;
  // 之前的时间戳
  let previous = 0;
  // 如果 options 没传则设为空对象
  if (!options) options = {};
  // 定时器回调函数
  let later = function () {
    // 如果设置了 leading，就将 previous 设为 0
    // 用于下面函数的第一个 if 判断
    previous = options.leading === false ? 0 : _.now();
    // 置空一是为了防止内存泄漏，二是为了下面的定时器判断
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function () {
    // 获得当前时间戳
    let now = _.now();
    // 首次进入前者肯定为 true
    // 如果需要第一次不执行函数
    // 就将上次时间戳设为当前的
    // 这样在接下来计算 remaining 的值时会大于0
    if (!previous && options.leading === false) previous = now;
    // 计算剩余时间
    let remaining = wait - (now - previous);
    context = this;
    args = arguments;
    // 如果当前调用已经大于上次调用时间 + wait
    // 或者用户手动调了时间
    // 如果设置了 trailing，只会进入这个条件
    // 如果没有设置 leading，那么第一次会进入这个条件
    // 还有一点，你可能会觉得开启了定时器那么应该不会进入这个 if 条件了
    // 其实还是会进入的，因为定时器的延时
    // 并不是准确的时间，很可能你设置了2秒
    // 但是他需要2.2秒才触发，这时候就会进入这个条件
    if (remaining <= 0 || remaining > wait) {
      // 如果存在定时器就清理掉否则会调用二次回调
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      // 判断是否设置了定时器和 trailing
      // 没有的话就开启一个定时器
      // 并且不能不能同时设置 leading 和 trailing
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};