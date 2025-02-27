const FileProcess = require('./lib/fileProcess');
const replaceTemplateContent = (content) => {
    return FileProcess.generateTemplate(messages, content, true);
};
const replaceScriptContent = (content) => {
    return FileProcess.generateScript(messages, content, true, Number(vue));
};

export function i18nPlugin() {
    return {
        name: 'vite-plugin-i18n',
        async transform(code, path) {
            if (path.indexOf('.js') > -1 || path.indexOf('.ts') > -1) {
                result = replaceScriptContent(code);
            } else {
                //处理vue文件
                result = code.replace(/(<template[^>]*>)((.|\n|\r)*)(<\/template>)/gim, (_, preTag, content, $3, afterTag) => {
                    return `${preTag}${replaceTemplateContent(content)}${afterTag}`;
                });
                result = result.replace(/(<script[^>]*>)((.|\n|\r)*)(<\/script>)/gim, (_, preTag, content, $3, afterTag) => {
                    return `${preTag}${replaceScriptContent(content)}${afterTag}`;
                });
            }
            return {
                code: result,
                map: null,
            }
        }
    }
}