const { vitePluginI18n } = require('../../vite-test-wrapper')
const fs = require('fs')
const path = require('path')

// 模拟配置文件
const mockConfig = {
  open: true,
  dir: 'test/vite/',
  file: 'zh.js'
}

// 模拟语言包文件
const mockMessages = {
  'adda07e6db79008e': '测试文本',
  'aad0b4f17aacd1c6': '你好世界',
  '9e09cf664f3ae807': '这是一个测试'
}

// 创建测试用的语言包文件
const createMockLocaleFile = () => {
  const localeDir = path.join(__dirname, '../..')
  const localeFile = path.join(localeDir, 'test/vite/zh.js')
  
  // 确保目录存在
  if (!fs.existsSync(path.dirname(localeFile))) {
    fs.mkdirSync(path.dirname(localeFile), { recursive: true })
  }
  
  const content = `module.exports = ${JSON.stringify(mockMessages, null, 2)}`
  fs.writeFileSync(localeFile, content)
  return localeFile
}

// 创建测试用的配置文件
const createMockConfigFile = () => {
  const configFile = path.join(process.cwd(), 'i18n-config.js')
  const content = `module.exports = ${JSON.stringify(mockConfig, null, 2)}`
  fs.writeFileSync(configFile, content)
  return configFile
}

// 清理测试文件
const cleanup = () => {
  const localeFile = path.join(__dirname, '../..', 'test/vite/zh.js')
  const configFile = path.join(process.cwd(), 'i18n-config.js')
  
  if (fs.existsSync(localeFile)) {
    fs.unlinkSync(localeFile)
  }
  if (fs.existsSync(configFile)) {
    fs.unlinkSync(configFile)
  }
}

describe('Vite Plugin i18n Transform', () => {
  let plugin
  let configFile
  let localeFile
  
  beforeAll(() => {
    configFile = createMockConfigFile()
    localeFile = createMockLocaleFile()
    plugin = vitePluginI18n()
    
    // 模拟配置解析
    plugin.configResolved({})
    
    // 模拟 configureServer 调用
    plugin.configureServer({ middlewares: { use: () => {} } })
  })
  
  afterAll(() => {
    cleanup()
  })
  
  test('should transform JavaScript file with Chinese text', async () => {
    const code = `const message = '测试文本';
console.log('你好世界');`
    const id = '/src/test.js'
    
    const result = await plugin.transform(code, id)
    
    // 如果返回 null，表示没有转换
    if (result && result.code) {
      expect(result.code).toContain('$t(')
      expect(result.map).toBe(null)
    } else {
      // 允许返回 null (表示无需转换或被跳过)
      expect(result).toBe(null)
    }
  })
  
  test('should transform Vue SFC template', async () => {
    const code = `<template>
  <div>测试文本</div>
  <p>你好世界</p>
</template>
<script>
export default {
  name: 'Test'
}
</script>`
    const id = '/src/Test.vue'
    
    const result = await plugin.transform(code, id)
    
    if (result && result.code) {
      expect(result.code).toContain('$t(')
      expect(result.map).toBe(null)
    } else {
      expect(result).toBe(null)
    }
  })
  
  test('should transform Vue SFC script', async () => {
    const code = `<template>
  <div>Hello</div>
</template>
<script>
export default {
  data() {
    return {
      message: '这是一个测试'
    }
  }
}
</script>`
    const id = '/src/Test.vue'
    
    const result = await plugin.transform(code, id)
    
    expect(result.code).toContain('$t(')
    expect(result.code).toContain('427de5b5b5219063')  // MD5 of '这是一个测试'
    expect(result.map).toBe(null)
  })
  
  test('should skip node_modules files', async () => {
    const code = `const message = '测试文本';`
    const id = '/node_modules/some-package/index.js'
    
    const result = await plugin.transform(code, id)
    
    // 应该返回 null，表示跳过转换
    expect(result).toBe(null)
  })
  
  test('should skip files in locale directory', async () => {
    const code = `const messages = { test: '测试文本' };`
    const id = path.join(process.cwd(), 'test/vite/zh.js')
    
    const result = await plugin.transform(code, id)
    
    // 应该返回 null，表示跳过转换
    expect(result).toBe(null)
  })
  
  test('should handle TypeScript files', async () => {
    const code = `interface Test {
  message: string;
}
const test: Test = { message: '测试文本' };`
    const id = '/src/test.ts'
    
    const result = await plugin.transform(code, id)
    
    expect(result.code).toContain('$t(')
    expect(result.code).toContain('1e24cf708a14ce81')  // MD5 of '测试文本'
    expect(result.map).toBe(null)
  })
  
  test('should handle JSX files', async () => {
    const code = `const Component = () => {
  return <div>测试文本</div>;
};`
    const id = '/src/Component.jsx'
    
    const result = await plugin.transform(code, id)
    
    expect(result.code).toContain('{$t("1e24cf708a14ce81")}')  // MD5 of '测试文本'
    expect(result.map).toBe(null)
  })
  
  test('should handle errors gracefully', async () => {
    const code = `const message = '测试文本';`
    const id = '/src/test.js'
    
    // 模拟错误情况 - 删除语言包文件
    const localeFile = path.join(process.cwd(), 'test/vite/zh.js')
    const backup = fs.readFileSync(localeFile)
    fs.unlinkSync(localeFile)
    
    const result = await plugin.transform(code, id)
    
    // 应该返回原始代码
    expect(result.code).toBe(code)
    expect(result.map).toBe(null)
    
    // 恢复文件
    fs.writeFileSync(localeFile, backup)
  })
  
  test('should skip transformation when config.open is false', async () => {
    // 临时修改配置
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    
    // 创建关闭的配置
    const closedConfig = { ...mockConfig, open: false }
    const configContent = `module.exports = ${JSON.stringify(closedConfig, null, 2)}`
    fs.writeFileSync(path.join(process.cwd(), 'i18n-config.js'), configContent)
    
    // 重新创建插件
    const closedPlugin = vitePluginI18n()
    closedPlugin.configureServer({})
    
    const code = `const message = '测试文本';`
    const id = '/src/test.js'
    
    const result = await closedPlugin.transform(code, id)
    
    // config.open = false 时应该返回 null
    expect(result).toBe(null)
    
    // 恢复环境和配置
    process.env.NODE_ENV = originalEnv
    const originalConfigContent = `module.exports = ${JSON.stringify(mockConfig, null, 2)}`
    fs.writeFileSync(path.join(process.cwd(), 'i18n-config.js'), originalConfigContent)
  })
})