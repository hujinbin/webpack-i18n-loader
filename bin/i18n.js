#!/usr/bin/env node
require('colors');
const packageInfo = require('../package.json');
const commander = require('commander');
const generate = require('../lib/generate');
const translate = require('../lib/translate');
const init = require('../lib/init');

commander.version(packageInfo.version, '-v, --version');

commander.command('generate [src]')
  .description('对src目录下的vue/js文件进行中文提取并生成国际化资源文件，默认src为执行目录下的src目录')
  .option('-p, --filepath <filepath>', '设置国际化文件的路径，默认为执行目录下的src/locale目录，请务必设置一个单独的目录来放置国际化资源文件')
  .option('-f, --filename <filename>', '设置生成文件的文件名，默认为 zh_cn，会自动添加.js 后缀')
  .action((src = 'src', {filepath = 'src/locale', filename = 'zh_cn'}) => {
    generate(src, {filepath, filename});
  });

commander.on('command:*', function () {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', commander.args.join(' '));
  process.exit(1);
});


commander.command('init')
.action(()=>{
  init();
})

commander.command('translate')
.action(()=>{

})

if (process.argv.length === 2) {
  commander.help();
}

commander.parse(process.argv);
