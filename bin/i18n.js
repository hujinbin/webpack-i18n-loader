#!/usr/bin/env node
require('colors');
const packageInfo = require('../package.json');
const program = require('commander');
const generate = require('../lib/generate');

program.version(packageInfo.version, '-v, --version');

program.command('generate [src]')
  .description('对src目录下的vue/js文件进行中文提取并生成国际化资源文件，默认src为执行目录下的src目录')
  .option('-p, --filepath <filepath>', '设置国际化文件的路径，默认为执行目录下的src/locale目录，请务必设置一个单独的目录来放置国际化资源文件')
  .option('-f, --filename <filename>', '设置生成文件的文件名，默认为 zh_cn，会自动添加.js 后缀')
  .action((src = 'src', {filepath = 'src/locale', filename = 'zh_cn'}) => {
    generate(src, {filepath, filename});
  });

program.on('command:*', function () {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
  process.exit(1);
});

if (process.argv.length === 2) {
  program.help();
}

program.parse(process.argv);
