const replace = require('../replace')
const fs = require('fs')

const config = {
    entry: __dirname + '/page.vue',
    id: 0,
}

let pageContent

beforeAll(() => {
    pageContent = fs.readFileSync(config.entry, 'utf-8')
})

afterAll(() => {
    fs.writeFileSync(config.entry, pageContent)
})

describe('list rendering', () => {
    test('should handle v-for list rendering with Chinese content', done => {
        replace(config).then(() => {
            fs.readFile(config.entry, 'utf-8', (err, source) => {
                if (err) throw err
                fs.readFile(__dirname + '/result.vue', 'utf-8', (err, result) => {
                    if (err) throw err
                    expect(source).toBe(result)
                    done()
                })
            })
        })
    }, 20000)
})
