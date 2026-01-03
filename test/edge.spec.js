const replace = require('./replace')
const fs = require('fs')
const path = require('path')

describe('edge cases', () => {
  test('空文件', done => {
    const file = __dirname + '/empty.js'
    fs.writeFileSync(file, '')
    replace({ entry: file }).then(() => {
      const result = fs.readFileSync(file, 'utf-8')
      expect(result).toBe('')
      fs.unlinkSync(file)
      done()
    })
  }, 20000)

  test('全英文内容', done => {
    const file = __dirname + '/en.js'
    fs.writeFileSync(file, "const msg = 'hello world'")
    replace({ entry: file }).then(() => {
      const result = fs.readFileSync(file, 'utf-8')
      expect(result).toBe("const msg = 'hello world'")
      fs.unlinkSync(file)
      done()
    })
  }, 20000)

  test('特殊符号内容', done => {
    const file = __dirname + '/symbol.js'
    fs.writeFileSync(file, "const msg = '测试!@#￥%……&*（）' ")
    replace({ entry: file }).then(() => {
      const result = fs.readFileSync(file, 'utf-8')
      expect(result).toContain('$t(')
      fs.unlinkSync(file)
      done()
    })
  }, 20000)

  test('无 entry 配置', done => {
    replace({}).then(() => {
      done()
    })
  }, 20000)

  test('无 options', done => {
    expect(() => replace()).not.toThrow()
    done()
  }, 20000)

  test('无 localeFile', done => {
    const file = __dirname + '/noLocale.js'
    fs.writeFileSync(file, "const msg = '测试'")
    replace({ entry: file, localeFile: './not-exist.js' }).then(() => {
      const result = fs.readFileSync(file, 'utf-8')
      expect(result).toBe("const msg = '测试'")
      fs.unlinkSync(file)
      done()
    })
  }, 20000)

  test('极端 include/exclude/extra 配置', done => {
    const file = __dirname + '/extreme.js'
    fs.writeFileSync(file, "const msg = '测试'")
    replace({ entry: file, include: [], exclude: [file], extra: /.never/ }).then(() => {
      const result = fs.readFileSync(file, 'utf-8')
      expect(result).toBe("const msg = '测试'")
      fs.unlinkSync(file)
      done()
    })
  }, 20000)

  test('极端路径', done => {
    const file = __dirname + '/../test/../test/edge-path.js'
    fs.writeFileSync(file, "const msg = '测试'")
    replace({ entry: file }).then(() => {
      const result = fs.readFileSync(file, 'utf-8')
      expect(result).toContain('$t(')
      fs.unlinkSync(file)
      done()
    })
  }, 20000)
})
