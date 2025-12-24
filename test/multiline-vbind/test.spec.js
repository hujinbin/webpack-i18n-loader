const FileProcess = require('../../lib/fileProcess')
const fs = require('fs')

describe('multiline-vbind', () => {
    test('should extract Chinese from multi-line v-bind attributes', () => {
        const content = fs.readFileSync(__dirname + '/page.vue', 'utf-8')
        const messages = {}
        
        // Extract template content
        const [, templateContent = ''] = content.match(/<template[^>]*>((.|\n|\r)*)<\/template>/im) || []
        
        // Process template
        const result = FileProcess.generateTemplate(messages, templateContent, false)
        
        // Verify all Chinese strings were extracted
        expect(Object.values(messages)).toContain('现金账户')
        expect(Object.values(messages)).toContain('返利账户')
        expect(Object.values(messages)).toContain('信用证账户')
        expect(Object.values(messages)).toContain('授信账户(中信保)')
        
        // Verify the result contains $t calls
        expect(result).toContain('$t(')
        expect(result).toMatch(/label:\s*\$t\(/)
    })
    
    test('should work with single-line v-bind', () => {
        const content = `<div :text="'测试'"></div>`
        const messages = {}
        
        const result = FileProcess.generateTemplate(messages, content, false)
        
        expect(Object.values(messages)).toContain('测试')
        expect(result).toContain('$t(')
    })
})
