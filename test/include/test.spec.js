const replace = require('../replace')
const fs = require('fs')

const config = {
    entry: __dirname + '/pages',
    include: [__dirname + '/pages/page1.js'],
    id: 0,
}

const config2 = {
    entry: __dirname + '/pages2',
    include: ['b'],
    id: 0,
}

let pageContent
let pageContent2
let pageContent3
let pageContent4

beforeAll(() => {
    pageContent = fs.readFileSync(__dirname + '/pages/page1.js', 'utf-8')
    pageContent2 = fs.readFileSync(__dirname + '/pages/page2.js', 'utf-8')
    pageContent3 = fs.readFileSync(__dirname + '/pages2/b/b.js', 'utf-8')
    pageContent4 = fs.readFileSync(__dirname + '/pages2/a.js', 'utf-8')
})

beforeEach(() => {
    // 恢复所有文件到原始状态
    fs.writeFileSync(__dirname + '/pages/page1.js', pageContent)
    fs.writeFileSync(__dirname + '/pages/page2.js', pageContent2)
    fs.writeFileSync(__dirname + '/pages2/b/b.js', pageContent3)
    fs.writeFileSync(__dirname + '/pages2/a.js', pageContent4)
})

afterAll(() => {
    fs.writeFileSync(__dirname + '/pages/page1.js', pageContent)
    fs.writeFileSync(__dirname + '/pages/page2.js', pageContent2)
    fs.writeFileSync(__dirname + '/pages2/b/b.js', pageContent3)
    fs.writeFileSync(__dirname + '/pages2/a.js', pageContent4)
})

describe('include', () => {
    test('include', done => {
        replace(config).then(() => {
            fs.readFile(__dirname + '/pages/page1.js', 'utf-8', (err, source) => {
                if (err) throw err
                expect(source).toBe(`const test = $t('0')`)
                done()
            })
        })
    }, 20000)

    test('uninclude', done => {
        replace(config).then(() => {
            fs.readFile(__dirname + '/pages/page2.js', 'utf-8', (err, source) => {
                if (err) throw err
                expect(source).toBe(`const test = '测试'`)
                done()
            })
        })
    }, 20000)

    test('mix', done => {
        replace(config2).then(() => {
            let done1, done2
            fs.readFile(__dirname + '/pages2/b/b.js', 'utf-8', (err, source) => {
                if (err) throw err
                expect(source).toBe(`const test = $t('0')`)
                done1 = true
                if (done1 && done2) done()
            })

            fs.readFile(__dirname + '/pages2/a.js', 'utf-8', (err, source) => {
                if (err) throw err
                expect(source).toBe(`const test = '测试'`)
                done2 = true
                if (done1 && done2) done()
            })
        })
    }, 20000)
})