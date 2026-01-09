const fs = require('fs')
const path = require('path')
const FileProcess = require(`${process.cwd()}/lib/fileProcess`);
const Utils = require('../lib/utils')

let config, exclude, include

// 全局 messages 对象，用于收集和存储翻译
let globalMessages = {}
let keyCounter = 0

// 自定义 key 生成函数
function generateKey(value, config) {
    if (config && typeof config.id !== 'undefined') {
        // 使用自增 ID 和前缀/后缀
        const prefix = config.prefix || ''
        const suffix = config.suffix || ''
        const key = `${prefix}${keyCounter}${suffix}`
        keyCounter++
        return key
    } else {
        // 使用默认的 MD5 方式
        return Utils.Md5_16(value)
    }
}

// 重写 Utils.Md5_16 为自定义函数
let originalMd5_16 = Utils.Md5_16
function patchUtils(config) {
    if (config && typeof config.id !== 'undefined') {
        // 临时替换 Md5_16 函数
        Utils.Md5_16 = (value) => generateKey(value, config)
    } else {
        Utils.Md5_16 = originalMd5_16
    }
}

function restoreUtils() {
    Utils.Md5_16 = originalMd5_16
}

function processFile(file, cb) {
    const ext = path.extname(file)
    let content = fs.readFileSync(file, 'utf-8')
    let result
    
    // 获取 pluginPrefix，默认为 $t
    const prefix = config.pluginPrefix || '$t'
    
    // 如果配置了 localeFile 但文件不存在，不进行转换
    if (config.localeFile && !fs.existsSync(path.resolve(process.cwd(), config.localeFile))) {
        cb && cb()
        return
    }
    
    // 检查 include 配置
    if (config.include && config.include.length > 0) {
        const normalizedFile = path.normalize(file)
        const isIncluded = config.include.some(pattern => {
            if (typeof pattern === 'string') {
                // 可能是完整路径或部分路径（如目录名）
                const normalizedPattern = path.normalize(pattern)
                // 完整路径匹配
                if (normalizedFile === normalizedPattern) {
                    return true
                }
                // 检查是否包含该路径片段（用于目录匹配，如 'b'）
                const fileParts = normalizedFile.split(path.sep)
                const patternParts = normalizedPattern.split(path.sep)
                // 如果 pattern 不包含路径分隔符，可能是目录名匹配
                if (patternParts.length === 1) {
                    return fileParts.includes(normalizedPattern)
                }
                // 否则必须完全匹配
                return false
            } else if (pattern instanceof RegExp) {
                return pattern.test(file)
            }
            return false
        })
        if (!isIncluded) {
            cb && cb()
            return
        }
    }
    
    // 检查 exclude 配置
    if (config.exclude && config.exclude.length > 0) {
        const isExcluded = config.exclude.some(pattern => {
            if (typeof pattern === 'string') {
                // 解析为绝对路径并标准化
                const absolutePattern = path.resolve(process.cwd(), pattern)
                const absoluteFile = path.resolve(process.cwd(), file)
                return absoluteFile === absolutePattern
            } else if (pattern instanceof RegExp) {
                return pattern.test(file)
            }
            return false
        })
        if (isExcluded) {
            cb && cb()
            return
        }
    }
    
    if (ext === '.vue') {
        // 只处理 template/script
        let [, templateContent = ''] = content.match(/<template[^>]*>((.|\n|\r)*)<\/template>/im) || [];
        let [, scriptContent = ''] = content.match(/<script[^>]*>((.|\n|\r)*)<\/script>/im) || [];
        result = content
        if (templateContent) {
            // 第一遍：收集翻译（needReplace = false）
            const replaced = require('../lib/fileProcess').generateTemplate(globalMessages, templateContent, false)
            let replacedContent = replaced.content || replaced
            // 替换 prefix
            if (prefix !== '$t') {
                replacedContent = replacedContent.replace(/\$t\(/g, `${prefix}(`)
            }
            result = result.replace(templateContent, replacedContent)
        }
        if (scriptContent) {
            // 第一遍：收集翻译（needReplace = false）
            const replaced = require('../lib/fileProcess').generateScript(globalMessages, scriptContent, false, 2)
            let replacedContent = replaced.content || replaced
            // 替换 prefix
            if (prefix !== '$t') {
                replacedContent = replacedContent.replace(/\$t\(/g, `${prefix}(`)
            }
            result = result.replace(scriptContent, replacedContent)
        }
    } else {
        // 第一遍：收集翻译（needReplace = false）
        result = require('../lib/fileProcess').generateScript(globalMessages, content, false, 2)
        if (typeof result === 'object' && result.content) {
            if (prefix !== '$t') {
                result.content = result.content.replace(/\$t\(/g, `${prefix}(`)
            }
        } else if (typeof result === 'string') {
            if (prefix !== '$t') {
                result = result.replace(/\$t\(/g, `${prefix}(`)
            }
        }
    }
    fs.writeFileSync(file, typeof result === 'string' ? result : result.content, 'utf-8')
    cb && cb()
}

function walkFiles(entry, files = []) {
    if (fs.existsSync(entry)) {
        const stat = fs.lstatSync(entry)
        if (stat.isDirectory()) {
            fs.readdirSync(entry).forEach(f => {
                walkFiles(path.join(entry, f), files)
            })
        } else {
            const ext = path.extname(entry)
            const validExts = [ '.js', '.vue', '.jsx', '.ts', '.tsx' ]
            let shouldProcess = validExts.includes(ext)
            
            // 检查 extra 配置
            if (!shouldProcess && config.extra) {
                if (config.extra instanceof RegExp) {
                    shouldProcess = config.extra.test(entry)
                }
            }
            
            if (shouldProcess) {
                files.push(entry)
            }
        }
    }
    return files
}

const generateVueFile = (file) => {
    let processFile = path.relative(process.cwd(), file);
    // if(processFile !== 'src/modules/DataSource/views/DataSourceList/DialogOfAdd.vue'){
    //   return false;
    // }
    console.log(`➤ ${processFile.yellow}`.blue);
    let content = fs.readFileSync(file, 'utf8');
    // // 获取模板部分
    let [, templateContent = ''] = content.match(/<template[^>]*>((.|\n|\r)*)<\/template>/im) || [];
    FileProcess.generateTemplate(messages, templateContent);
    //获取script部分
    let [, scriptContent = ''] = content.match(/<script[^>]*>((.|\n|\r)*)<\/script>/im) || [];
    FileProcess.generateScript(messages, scriptContent);
    console.log(`✔ ${processFile.yellow}`.green);
  };
  const generateJsFile = (file) => {
    let processFile = path.relative(process.cwd(), file);
    // if(processFile !== 'src/modules/DataModel/services/model.js'){
    //   return false;
    // }
    console.log(`➤ ${processFile.yellow}`.blue);
    let content = fs.readFileSync(file, 'utf8');
    FileProcess.generateScript(messages, content);
    console.log(`✔ ${processFile.yellow}`.green);
  };



module.exports = function replace(i18nConfig) {
    return new Promise(resolve => {
        config = i18nConfig || {}
        
        // 重置 globalMessages 和计数器
        globalMessages = {}
        keyCounter = typeof config.id !== 'undefined' ? config.id : 0
        
        // 应用配置补丁
        patchUtils(config)
        
        const entry = config.entry ? path.resolve(process.cwd(), config.entry) : null
        if (!entry || !fs.existsSync(entry)) {
            restoreUtils()
            return resolve()
        }
        
        const files = walkFiles(entry)
        let count = files.length
        if (count === 0) {
            restoreUtils()
            return resolve()
        }
        
        files.forEach(file => {
            processFile(file, () => {
                count--
                if (count === 0) {
                    restoreUtils()
                    resolve()
                }
            })
        })
    })
}