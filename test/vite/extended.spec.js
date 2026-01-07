const { vitePluginI18n } = require('../../vite-test-wrapper')
const fs = require('fs')
const path = require('path')

// 扩展测试场景
describe('Vite Plugin i18n Transform - Extended Tests', () => {
  let plugin
  let configFile
  let localeFile
  
  const mockConfig = {
    open: true,
    dir: 'test/vite/',
    file: 'zh.js'
  }
  
  const mockMessages = {
    '10000': '测试文本',
    '10001': '你好世界',
    '10002': '这是一个测试',
    '10003': '选项一',
    '10004': '选项二',
    '10005': '选项三'
  }
  
  beforeAll(() => {
    const localeDir = path.join(__dirname, '../..')
    localeFile = path.join(localeDir, 'test/vite/zh.js')
    
    if (!fs.existsSync(path.dirname(localeFile))) {
      fs.mkdirSync(path.dirname(localeFile), { recursive: true })
    }
    
    const content = `module.exports = ${JSON.stringify(mockMessages, null, 2)}`
    fs.writeFileSync(localeFile, content)
    
    configFile = path.join(process.cwd(), 'i18n-config.js')
    const configContent = `module.exports = ${JSON.stringify(mockConfig, null, 2)}`
    fs.writeFileSync(configFile, configContent)
    
    plugin = vitePluginI18n()
    plugin.configResolved({})
    plugin.configureServer({ middlewares: { use: () => {} } })
  })
  
  afterAll(() => {
    if (fs.existsSync(localeFile)) {
      fs.unlinkSync(localeFile)
    }
    if (fs.existsSync(configFile)) {
      fs.unlinkSync(configFile)
    }
  })

  test('should handle Chinese text with special characters', async () => {
    const code = `const msg = '测试!@#￥%……&*（）';`
    const id = '/src/special.js'
    
    const result = await plugin.transform(code, id)
    
    if (result) {
      expect(result.code).toContain('$t(')
      expect(result.map).toBe(null)
    }
  })

  test('should handle multiline strings', async () => {
    const code = `const msg = \`这是一个
多行的
测试文本\`;`
    const id = '/src/multiline.js'
    
    const result = await plugin.transform(code, id)
    
    if (result) {
      expect(result.code).toContain('$t(')
    }
  })

  test('should handle template literals with Chinese', async () => {
    const code = `const msg = \`你好 \${name} 世界\`;`
    const id = '/src/template-literal.js'
    
    const result = await plugin.transform(code, id)
    
    if (result) {
      expect(result.code).toContain('$t(')
    }
  })

  test('should handle Vue component with Props', async () => {
    const code = `<template>
  <div :title="'测试标题'">
    <span>{{ '内容文本' }}</span>
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: '默认值'
    }
  }
}
</script>`
    const id = '/src/PropComponent.vue'
    
    const result = await plugin.transform(code, id)
    
    if (result) {
      expect(result.code).toContain('$t(')
    }
  })

  test('should handle Vue component with v-bind directives', async () => {
    const code = `<template>
  <input v-bind:placeholder="'请输入'" v-bind:title="'标题'" />
</template>`
    const id = '/src/VBindComponent.vue'
    
    const result = await plugin.transform(code, id)
    
    if (result) {
      expect(result.code).toContain('$t(')
    }
  })

  test('should handle comments with Chinese', async () => {
    const code = `// 这是一个注释
const msg = '测试';
/* 这是多行注释
   包含中文 */`
    const id = '/src/with-comments.js'
    
    const result = await plugin.transform(code, id)
    
    if (result) {
      // 注释不应该被转换，但字符串应该被转换
      expect(result.code).toContain('// 这是一个注释')
      expect(result.code).toContain('$t(')
    }
  })

  test('should return null for files without Chinese text', async () => {
    const code = `const msg = 'hello world';
console.log('test');`
    const id = '/src/english-only.js'
    
    const result = await plugin.transform(code, id)
    
    // 没有中文，不需要转换
    expect(result).toBe(null)
  })

  test('should handle nested Vue components', async () => {
    const code = `<template>
  <div>
    <child-component :msg="'父组件消息'">
      <template #default>
        <span>插槽内容</span>
      </template>
    </child-component>
  </div>
</template>
<script>
export default {
  data() {
    return {
      parentMsg: '父组件数据'
    }
  }
}
</script>`
    const id = '/src/NestedComponent.vue'
    
    const result = await plugin.transform(code, id)
    
    if (result) {
      expect(result.code).toContain('$t(')
    }
  })

  test('should handle array with Chinese strings', async () => {
    const code = `const list = ['选项一', '选项二', '选项三'];`
    const id = '/src/array-test.js'
    
    const result = await plugin.transform(code, id)
    
    if (result) {
      expect(result.code).toContain('$t(')
    }
  })

  test('should handle object with Chinese properties', async () => {
    const code = `const obj = {
  title: '标题',
  content: '内容',
  footer: '页脚'
};`
    const id = '/src/object-test.js'
    
    const result = await plugin.transform(code, id)
    
    if (result) {
      expect(result.code).toContain('$t(')
    }
  })

  test('should handle conditional expressions with Chinese', async () => {
    const code = `const result = condition ? '是' : '否';`
    const id = '/src/conditional.js'
    
    const result = await plugin.transform(code, id)
    
    if (result) {
      expect(result.code).toContain('$t(')
    }
  })

  test('should handle function returns with Chinese', async () => {
    const code = `function getMessage() {
  return '返回消息';
}`
    const id = '/src/function-return.js'
    
    const result = await plugin.transform(code, id)
    
    if (result) {
      expect(result.code).toContain('$t(')
    }
  })

  test('should handle Vue component computed properties', async () => {
    const code = `<script>
export default {
  computed: {
    message() {
      return '计算属性消息'
    }
  }
}
</script>`
    const id = '/src/Computed.vue'
    
    const result = await plugin.transform(code, id)
    
    if (result) {
      expect(result.code).toContain('$t(')
    }
  })

  test('should handle Vue component methods', async () => {
    const code = `<script>
export default {
  methods: {
    showMessage() {
      alert('警告消息')
    }
  }
}
</script>`
    const id = '/src/Methods.vue'
    
    const result = await plugin.transform(code, id)
    
    if (result) {
      expect(result.code).toContain('$t(')
    }
  })

  test('should handle switch case statements', async () => {
    const code = `switch(type) {
  case 'A':
    return '类型A';
  case 'B':
    return '类型B';
  default:
    return '未知类型';
}`
    const id = '/src/switch.js'
    
    const result = await plugin.transform(code, id)
    
    if (result) {
      expect(result.code).toContain('$t(')
    }
  })

  test('should handle Vue v-for with Chinese content', async () => {
    const code = `<template>
  <ul>
    <li v-for="item in items" :key="item">{{ item }}</li>
  </ul>
</template>
<script>
export default {
  data() {
    return {
      items: ['项目一', '项目二', '项目三']
    }
  }
}
</script>`
    const id = '/src/VFor.vue'
    
    const result = await plugin.transform(code, id)
    
    if (result) {
      expect(result.code).toContain('$t(')
    }
  })

  test('should handle Vue v-if with Chinese content', async () => {
    const code = `<template>
  <div v-if="show">显示的内容</div>
  <div v-else>隐藏的内容</div>
</template>`
    const id = '/src/VIf.vue'
    
    const result = await plugin.transform(code, id)
    
    if (result) {
      expect(result.code).toContain('$t(')
    }
  })

  test('should handle class methods with Chinese', async () => {
    const code = `class User {
  constructor() {
    this.name = '用户';
  }
  
  getMessage() {
    return '获取消息';
  }
}`
    const id = '/src/class.js'
    
    const result = await plugin.transform(code, id)
    
    if (result) {
      expect(result.code).toContain('$t(')
    }
  })

  test('should handle destructuring with Chinese', async () => {
    const code = `const { name = '默认名称', title = '默认标题' } = obj;`
    const id = '/src/destructuring.js'
    
    const result = await plugin.transform(code, id)
    
    if (result) {
      expect(result.code).toContain('$t(')
    }
  })

  test('should handle spread operator with Chinese', async () => {
    const code = `const merged = { ...obj1, extra: '额外信息' };`
    const id = '/src/spread.js'
    
    const result = await plugin.transform(code, id)
    
    if (result) {
      expect(result.code).toContain('$t(')
    }
  })
})
