const path = require('path');
// vue.config.js
module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: [
           {
            loader: 'webpack-in-loader', //一定要作为第一个loader
            options: {
              localeFile: path.join(process.cwd(), 'src/locale/zh.js') //与cli中相同，若生成的时候保持默认，则不需要配置
            }
          }],
        },
        {
          test: /\.ts$/,
          use: [
          {
            loader: 'webpack-in-loader', //一定要作为第一个loader
            options: {
              localeFile: path.join(process.cwd(), 'src/locale/zh.js') //与cli中相同，若生成的时候保持默认，则不需要配置
            }
          },
          ],
        },
      ]
    }
  }
}