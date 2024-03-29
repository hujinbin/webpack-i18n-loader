### 更新日志
<a name="1.4.0"></a>
## [1.4.0](https://github.com/hujinbin/webpack-i18n-loader/tree/v1.4.0)

#### 1.4.0

* 自动翻译接入ChatGpt方式,新增翻译进度展示
* 优化配置项初始化


<a name="1.3.10"></a>
## [1.3.10](https://github.com/hujinbin/webpack-i18n-loader/tree/v1.3.10)

#### 1.3.10

* 优化js文件的单行注释过滤规则
* 插件依赖问题


<a name="1.3.8"></a>
## [1.3.8](https://github.com/hujinbin/webpack-i18n-loader/tree/v1.3.8)

#### 1.3.8

* 优化js文件的单行注释过滤规则


<a name="1.3.7"></a>
## [1.3.7](https://github.com/hujinbin/webpack-i18n-loader/tree/v1.3.7)

#### 1.3.7

* 代码优化，缩减npm的大小
* 修复main.js内包含中文报错问题


<a name="1.3.6"></a>
## [1.3.6](https://github.com/hujinbin/webpack-i18n-loader/tree/v1.3.6)

#### 1.3.6

* clear命令的清理规则优化


<a name="1.3.5"></a>
## [1.3.5](https://github.com/hujinbin/webpack-i18n-loader/tree/v1.3.5)

#### 1.3.5

* 修复window系统vue文件因换行符国际化未转化问题


<a name="1.3.4"></a>
## [1.3.4](https://github.com/hujinbin/webpack-i18n-loader/tree/v1.3.4)

#### 1.3.4

* 修复window系统vue文件因换行符导致的不兼容问题
* 新增自动翻译单次请求的限制配置项


<a name="1.3.3"></a>
## [1.3.3](https://github.com/hujinbin/webpack-i18n-loader/tree/v1.3.3)

#### 1.3.3

* 支持distLangs参数的多语种同时翻译
* 优化语言抓取丢失空格的问题


<a name="1.3.1"></a>
## [1.3.1](https://github.com/hujinbin/webpack-i18n-loader/tree/v1.3.1)

#### 1.3.1

* 修复loader运行，获取vue版本报错问题。


<a name="1.3.0"></a>
## [1.3.0](https://github.com/hujinbin/webpack-i18n-loader/tree/v1.3.0)

#### 1.3.0

* 兼容vue3版本的使用


<a name="1.2.0"></a>
## [1.2.0](https://github.com/hujinbin/webpack-i18n-loader/tree/v1.2.0)

#### 1.2.0

* 翻译功能支持选择定向文件翻译


<a name="1.1.9"></a>
## [1.1.9](https://github.com/hujinbin/webpack-i18n-loader/tree/v1.1.9)

#### 1.1.9

* fix: 修复使用忽略功能后webpack进程卡住问题


<a name="1.1.8"></a>
## [1.1.8](https://github.com/hujinbin/webpack-i18n-loader/tree/v1.1.8)

#### 1.1.8

* fix: 修复loader转换错误问题
* loader转换忽略node_modules文件夹


<a name="1.1.7"></a>
## [1.1.7](https://github.com/hujinbin/webpack-i18n-loader/tree/v1.1.7)

#### 1.1.7

* fix: 修复loader处理过程中js等文件未转换问题
* vue文件内template内容转换优化


<a name="1.1.6"></a>
## [1.1.6](https://github.com/hujinbin/webpack-i18n-loader/tree/v1.1.6)

#### 1.1.6

* 兼容ts,tsx文件
* vue文件内template内容转换优化


<a name="1.1.5"></a>
## [1.1.5](https://github.com/hujinbin/webpack-i18n-loader/tree/v1.1.5)

#### 1.1.5

* 忽略中文抓取（优化规则）


<a name="1.1.4"></a>
## [1.1.4](https://github.com/hujinbin/webpack-i18n-loader/tree/v1.1.4)

#### 1.1.4

* 新增忽略中文抓取功能


<a name="1.1.3"></a>
## [1.1.3](https://github.com/hujinbin/webpack-i18n-loader/tree/v1.1.3)

#### 1.1.3

* 优化jsx的attr属性包含中文转化问题
* 新增clear指令（用于清理已经不在使用的语言包）


<a name="1.1.2"></a>
## [1.1.2](https://github.com/hujinbin/webpack-i18n-loader/tree/v1.1.2)

#### 1.1.2

* 优化英文翻译的html标签格式


<a name="1.1.1"></a>
## [1.1.1](https://github.com/hujinbin/webpack-i18n-loader/tree/v1.1.1)

#### 1.1.1

* 优化英文翻译的html标签和英文翻译规范


<a name="1.1.0"></a>
## [1.1.0](https://github.com/hujinbin/webpack-i18n-loader/tree/v1.1.0)

#### 1.1.0

* 修复因request npm 包弃用下架造成的报错问题
* 优化抓取中文抓取到不包含中文内容的问题


<a name="1.0.11"></a>
## [1.0.11](https://github.com/hujinbin/webpack-i18n-loader/tree/v1.0.11)

#### 1.0.11

* 修复抓取中文后的原有内容的转义问题



<a name="1.0.10"></a>
## [1.0.10](https://github.com/hujinbin/webpack-i18n-loader/tree/v1.0.10)

#### 1.0.10

* leader是否启用 打包环境下不生效
* 同步百度翻译api，已支持各国语言
* 翻译映射表修改全量导入



<a name="1.0.9"></a>
## [1.0.9](https://github.com/hujinbin/webpack-i18n-loader/tree/v1.0.9)

#### 1.0.9

* 自动抓取中文
* 百度自动翻译，并生成中英文映射表，暂时只支持中译英
* 中英文映射表修改导入功能




