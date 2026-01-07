const replace = require('../replace')
const fs = require('fs')

const config = {
    entry: __dirname + '/pages',
    exclude: [__dirname + '/pages/page2.js'],
    id: 0,
}

let pageContent
let pageContent2

beforeAll(() => {
    pageContent = fs.readFileSync(__dirname + '/pages/page1.js', 'utf-8')
    pageContent2 = fs.readFileSync(__dirname + '/pages/page2.js', 'utf-8')
})

beforeEach(() => {
    // 恢复所有文件到原始状态
    fs.writeFileSync(__dirname + '/pages/page1.js', pageContent)
    fs.writeFileSync(__dirname + '/pages/page2.js', pageContent2)
})

afterAll(() => {
    fs.writeFileSync(__dirname + '/pages/page1.js', pageContent)
    fs.writeFileSync(__dirname + '/pages/page2.js', pageContent2)
})

describe('exclude', () => {
    test('page1', done => {
        replace(config).then(() => {
            fs.readFile(__dirname + '/pages/page1.js', 'utf-8', (err, source) => {
                if (err) throw err
                expect(source).toBe(`const test = $t('0')`)
                done()
            })
        })
    }, 20000)

    test('page2', done => {
        replace(config).then(() => {
            fs.readFile(__dirname + '/pages/page2.js', 'utf-8', (err, source) => {
                if (err) throw err
                expect(source).toBe(`const test = '测试'`)
                done()
            })
        })
    }, 20000)
})