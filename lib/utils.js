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
