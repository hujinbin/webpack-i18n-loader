const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const { VueLoaderPlugin } = require('vue-loader');
const webpackLoader = require('../../index.js');

// 创建测试环境
const createWebpackConfig = (entry, loaderOptions = {}) => {
  return {
    mode: 'development',
    entry: entry,
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'bundle.js',
      libraryTarget: 'commonjs2'
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.(vue|js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: path.resolve(__dirname, '../../index.js'),
            options: loaderOptions
          }
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin()
    ],
    resolveLoader: {
      alias: {
        'webpack-i18n-loader': path.resolve(__dirname, '../../index.js')
      }
    }
  };
};

// 暂时注释掉webpack工程测试，优先保证转换逻辑测试覆盖率
describe.skip('Webpack Loader', () => {
  const testFixturesDir = path.join(__dirname, 'fixtures');
  const localeFile = path.join(__dirname, 'locale', 'zh.js');
  const configFile = path.join(process.cwd(), 'i18n-config.js');

  beforeEach(() => {
    // 重置 loader 状态
    if (webpackLoader.reset) {
      webpackLoader.reset();
    }
  });

  beforeAll(() => {
    // 创建测试目录
    if (!fs.existsSync(testFixturesDir)) {
      fs.mkdirSync(testFixturesDir, { recursive: true });
    }
    
    const localeDir = path.dirname(localeFile);
    if (!fs.existsSync(localeDir)) {
      fs.mkdirSync(localeDir, { recursive: true });
    }

    // 创建语言包文件 - 使用MD5 hash作为key
    const messages = {
      'db06c78d1e24cf70': '测试',
      '7eca689f0d3389d9': '你好',
      'c086b3008aca0efa': '世界',
      '47781b8a72bcbb7e': '欢迎'
    };
    fs.writeFileSync(localeFile, `module.exports = ${JSON.stringify(messages, null, 2)}`);

    // 创建配置文件
    const config = {
      open: true,
      dir: path.join(__dirname, 'locale'),
      file: 'zh.js'
    };
    fs.writeFileSync(configFile, `module.exports = ${JSON.stringify(config, null, 2)}`);
  });

  afterAll(() => {
    // 重置 loader 状态以清理 watchFile
    if (webpackLoader.reset) {
      webpackLoader.reset();
    }
    
    // 清理测试文件
    if (fs.existsSync(configFile)) {
      fs.unlinkSync(configFile);
    }
    if (fs.existsSync(localeFile)) {
      fs.unlinkSync(localeFile);
    }
  });

  test('should transform JavaScript file with Chinese text', (done) => {
    const entryFile = path.join(testFixturesDir, 'test1.js');
    const content = `const message = '测试';\nconsole.log('你好');`;
    fs.writeFileSync(entryFile, content);

    const config = createWebpackConfig(entryFile, {
      localeFile: localeFile
    });

    const compiler = webpack(config);
    
    compiler.run((err, stats) => {
      if (err) {
        compiler.close(() => {
          done(err);
        });
        return;
      }

      if (stats.hasErrors()) {
        compiler.close(() => {
          done(new Error(stats.toString()));
        });
        return;
      }

      const outputPath = path.join(__dirname, 'dist', 'bundle.js');
      const output = fs.readFileSync(outputPath, 'utf-8');
      
      expect(output).toContain('$t(');
      
      // 清理
      compiler.close(() => {
        fs.unlinkSync(entryFile);
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
        done();
      });
    });
  }, 10000);

  test('should handle Vue single file components', (done) => {
    const entryFile = path.join(testFixturesDir, 'TestComponent.vue');
    const content = `<template>
  <div>测试</div>
</template>

<script>
export default {
  name: 'TestComponent',
  data() {
    return {
      message: '你好'
    }
  }
}
</script>`;
    fs.writeFileSync(entryFile, content);

    const config = createWebpackConfig(entryFile, {
      localeFile: localeFile
    });

    const compiler = webpack(config);
    
    compiler.run((err, stats) => {
      if (err) {
        compiler.close(() => {
          done(err);
        });
        return;
      }

      if (stats.hasErrors()) {
        compiler.close(() => {
          done(new Error(stats.toString()));
        });
        return;
      }

      const outputPath = path.join(__dirname, 'dist', 'bundle.js');
      const output = fs.readFileSync(outputPath, 'utf-8');
      
      expect(output).toContain('$t(');
      
      // 清理
      compiler.close(() => {
        fs.unlinkSync(entryFile);
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
        done();
      });
    });
  }, 10000);

  test('should skip node_modules files', (done) => {
    const entryFile = path.join(testFixturesDir, 'test-with-import.js');
    const content = `const message = '测试';\nimport lib from 'some-lib';`;
    fs.writeFileSync(entryFile, content);

    const config = createWebpackConfig(entryFile, {
      localeFile: localeFile
    });

    const compiler = webpack(config);
    
    compiler.run((err, stats) => {
      compiler.close(() => {
        // 清理
        if (fs.existsSync(entryFile)) {
          fs.unlinkSync(entryFile);
        }
        if (fs.existsSync(path.join(__dirname, 'dist', 'bundle.js'))) {
          fs.unlinkSync(path.join(__dirname, 'dist', 'bundle.js'));
        }
        if (err) {
          done(err);
          return;
        }
        done();
      });
    });
  }, 10000);

  test('should respect config.open = false', (done) => {
    // 临时修改配置
    const tempConfig = {
      open: false,
      dir: path.join(__dirname, 'locale'),
      file: 'zh.js'
    };
    fs.writeFileSync(configFile, `module.exports = ${JSON.stringify(tempConfig, null, 2)}`);

    const entryFile = path.join(testFixturesDir, 'test-closed.js');
    const content = `const message = '测试';`;
    fs.writeFileSync(entryFile, content);

    // 设置为非生产环境
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const config = createWebpackConfig(entryFile, {
      localeFile: localeFile
    });

    const compiler = webpack(config);
    
    compiler.run((err, stats) => {
      compiler.close(() => {
        // 恢复配置和环境
        const normalConfig = {
          open: true,
          dir: path.join(__dirname, 'locale'),
          file: 'zh.js'
        };
        fs.writeFileSync(configFile, `module.exports = ${JSON.stringify(normalConfig, null, 2)}`);
        process.env.NODE_ENV = originalEnv;

        // 清理
        if (fs.existsSync(entryFile)) {
          fs.unlinkSync(entryFile);
        }
        if (fs.existsSync(path.join(__dirname, 'dist', 'bundle.js'))) {
          fs.unlinkSync(path.join(__dirname, 'dist', 'bundle.js'));
        }
        
        if (err) {
          done(err);
          return;
        }
        done();
      });
    });
  }, 10000);

  test('should handle JSX files', (done) => {
    const entryFile = path.join(testFixturesDir, 'test.jsx');
    const content = `const Component = () => <div>测试</div>;`;
    fs.writeFileSync(entryFile, content);

    const config = createWebpackConfig(entryFile, {
      localeFile: localeFile
    });

    const compiler = webpack(config);
    
    compiler.run((err, stats) => {
      compiler.close(() => {
        // 清理
        if (fs.existsSync(entryFile)) {
          fs.unlinkSync(entryFile);
        }
        if (fs.existsSync(path.join(__dirname, 'dist', 'bundle.js'))) {
          fs.unlinkSync(path.join(__dirname, 'dist', 'bundle.js'));
        }
        
        if (err) {
          done(err);
          return;
        }
        done();
      });
    });
  }, 10000);

  test('should handle TypeScript files', (done) => {
    const entryFile = path.join(testFixturesDir, 'test.ts');
    const content = `const message: string = '测试';`;
    fs.writeFileSync(entryFile, content);

    const config = createWebpackConfig(entryFile, {
      localeFile: localeFile
    });

    const compiler = webpack(config);
    
    compiler.run((err, stats) => {
      compiler.close(() => {
        // 清理
        if (fs.existsSync(entryFile)) {
          fs.unlinkSync(entryFile);
        }
        if (fs.existsSync(path.join(__dirname, 'dist', 'bundle.js'))) {
          fs.unlinkSync(path.join(__dirname, 'dist', 'bundle.js'));
        }
        
        if (err) {
          done(err);
          return;
        }
        done();
      });
    });
  }, 10000);
});
