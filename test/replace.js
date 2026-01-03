const fs = require('fs')
const path = require('path')
const FileProcess = require(`${process.cwd()}/lib/fileProcess`);
// const processSource = require(`${process.cwd()}/lib/processSource`)
// const generateI18nData = require(`${process.cwd()}/lib/generate`)
// const { setDefaultData, isInclude, isExclude } = require(`${process.cwd()}/lib/utils`)

const Utils = require('../lib/utils')
let config, exclude, include


function processFile(file, cb) {
    const ext = path.extname(file)
    let content = fs.readFileSync(file, 'utf-8')
    let result
    if (ext === '.vue') {
        // 只处理 template/script
        let [, templateContent = ''] = content.match(/<template[^>]*>((.|\n|\r)*)<\/template>/im) || [];
        let [, scriptContent = ''] = content.match(/<script[^>]*>((.|\n|\r)*)<\/script>/im) || [];
        result = content
        if (templateContent) {
            const replaced = require('../lib/fileProcess').generateTemplate({}, templateContent, true)
            result = result.replace(templateContent, replaced)
        }
        if (scriptContent) {
            const replaced = require('../lib/fileProcess').generateScript({}, scriptContent, true, 2)
            result = result.replace(scriptContent, replaced)
        }
    } else {
        result = require('../lib/fileProcess').generateScript({}, content, true, 2)
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
            if ([ '.js', '.vue', '.jsx', '.ts', '.tsx' ].includes(path.extname(entry))) {
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
        const entry = config.entry ? path.resolve(process.cwd(), config.entry) : null
        if (!entry || !fs.existsSync(entry)) return resolve()
        const files = walkFiles(entry)
        let count = files.length
        if (count === 0) return resolve()
        files.forEach(file => {
            processFile(file, () => {
                count--
                if (count === 0) resolve()
            })
        })
    })
}