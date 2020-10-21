# webpack-i18n-loader

---

vue-i18n@5.x版本的wepback loader，给出一个简单的demo。

*HTML*

```html
<div>你好，世界</div>
```

*资源文件*

```javascript
//zh.js
module.exports = {
  "a018615b35588a01": "你好，世界" //key是根据中文生成16的MD5
}

//en.js
module.exports = {
  "a018615b35588a01": "Hello, world" //key是根据中文生成16的MD5
}
```

*页面在中文下展示为*

你好世界

*在英文下展示为*

Hello, world

## 介绍

该loader的主要目的是将国际化资源与项目代码分离维护，这样我们去查找对应文案的时候更加简单方便，如上述demo所示，我们原文件中不需要去使用 `<div>{{ $t('a018615b35588a01') }}</div>` 的方式去显示声明国际化，通过loader自动进行替换完成我们的国际化工作，这样对开发查找页面文案之类带来了极大的方便。本组件还支持在vue的props中以及单独的js文件中进行国际化处理。

## 安装

```bash
npm i webpack-i18n-loader --save-dev

yarn add webpack-i18n-loader --dev
```

## 使用

本组件分为两部分，一部分是cli，目的是为了生成资源文件，一部分是loader，目的是为了替换项目中的中文为国际化的代码，我们最好在打包测试/上线前执行以下cli命令，生成资源文件，然后拷贝一份资源文件给翻译组进行各国语言的翻译，之后将资源文件配置到vue-18n@5.x上，再进行打包即可。

### cli的使用

项目根目录执行

```bash
npx i18n generate -h
Usage: i18n generate [options] [src]

对src目录下的vue/js文件进行中文提取并生成国际化资源文件，默认src为执行目录下的src目录

Options:
  -p, --filepath <filepath>  设置国际化文件的路径，默认为执行目录下的src/locale目录，请务必设置一个单独的目录来放置国际化资源文件
  -f, --filename <filename>  设置生成文件的文件名，默认为 zh，会自动添加.js 后缀
  -h, --help                 output usage information
```

请务必记住上述的国际化资源文件的路径和文件名，loader中需要配置，若未设置采用默认，loader中也可以不用设置

### loader的使用

loader中需要对两个部分进行配置，一个是vue文件，一个是js文件。

```javascript
const path = require('path');

module.exports = {
  //其他配置
  module:{
    rules:[
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
          },
          {
            loader: 'webpack-i18n-loader', //一定要作为第一个loader
            options:{
              localeFile: path.join(process.cwd(), 'src/locale/zh.js') //与cli中相同，若生成的时候保持默认，则不需要配置
            }
          }
        ]
      },
      {
        test: /\.jsx?$/,
        include: [resolve('src')],
        use:[
          {
            loader: 'babel-loader',
          },
          {
            loader: 'webpack-i18n-loader', //一定要作为第一个loader
            options:{
              localeFile: path.join(process.cwd(), 'src/locale/zh.js') //与cli中相同，若生成的时候保持默认，则不需要配置
            }
          }
        ]
      },
    ]
  }
}
```

### 国际化资源配置

此处一定要注意！！！否则是个坑。

国际化的配置一定一定要在所有逻辑之前，建议采用 i18n.js 文件单独配置，然后在入口文件最先引入这个文件即可！

```javascript
//i18n.js 国际化配置文件
import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);
Vue.config.lang = 'zh';
Vue.locale('zh', {
  ...require('./locale/zh'),
});

//main.js 入口文件

```


### 自动翻译

```bash
npx i18n init 
初始化翻译配置项

npx i18n translate
开始翻译文件
```

初始化项目，生成的配置文件 i18n-config.json
```bash
module.exports = {
    dir: "./src/locale", // 目标目录
    file: 'zh.js', // 翻译的文件
    distLangs: ['en'], // 要翻译的语言
    appId:'', // 百度翻译appid
    secret:'', // 百度翻译密钥
};
```


## 注意

- cli命令建议在根目录直接执行 `npx i18n generate`,这样在配置loader的时候不需要额外配置，减少出错几率，如果需要自己配置参数，一定要记住，国际化资源目录一定要是单独的，否则会被loader替换的时候将资源文件也替换掉，同时在配置loader 的时候，参数值一定为目录+文件名的值（包括后缀）
- 一定要在所有逻辑之前进行国际化配置，否则初始化 $t 方法的时候会出错，建议直接用一个单独的文件进行配置并在入口文件行首引入
- 建议字符串的连接用模板字符串方式，这样其中涉及到的一些动态参数也会自动生成 {0} {1} 这样的参数注入
- 项目还在完善中，欢迎大家pr

