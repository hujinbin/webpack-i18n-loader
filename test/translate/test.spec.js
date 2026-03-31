/**
 * translate 功能单元测试
 * 覆盖范围：
 *   - 配置文件缺失检测
 *   - 源语言文件缺失检测
 *   - 百度翻译：成功、API错误码、网络错误、已全部翻译
 *   - singleNum 上下限边界自动修正
 *   - 分段翻译（超出 singleNum 时分批调用）
 *   - chatGPT 模式翻译
 *   - filename 参数（带前缀的翻译文件名）
 *   - 多语言（distLangs 包含多个目标语言）
 */

const path = require('path')
const fs = require('fs')
const os = require('os')

let translate
let axiosMock
let mockCreateChatCompletion
let tmpDir
let originalCwd

const setupConfig = (overrides = {}) => {
    const config = {
        dir: './locale/',
        file: 'zh.js',
        distLangs: ['en'],
        mode: 'Baidu',
        appId: 'test-app-id',
        secret: 'test-secret',
        openAiKey: '',
        singleNum: 1000,
        ...overrides,
    }
    fs.writeFileSync(
        path.join(tmpDir, 'i18n-config.js'),
        `module.exports = ${JSON.stringify(config)};`
    )
}

const setupLocale = (data, filename = 'zh.js') => {
    const dir = path.join(tmpDir, 'locale')
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(
        path.join(dir, filename),
        `module.exports = ${JSON.stringify(data)};`
    )
}

const readOutput = (filename) => {
    const filePath = path.join(tmpDir, 'locale', filename)
    delete require.cache[filePath]
    return require(filePath)
}

beforeAll(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'i18n-translate-test-'))
    fs.mkdirSync(path.join(tmpDir, 'locale'), { recursive: true })
    originalCwd = process.cwd()
})

afterAll(() => {
    try { process.chdir(originalCwd) } catch (e) {}
    try { fs.rmSync(tmpDir, { recursive: true, force: true }) } catch (e) {}
})

beforeEach(() => {
    const configFile = path.join(tmpDir, 'i18n-config.js')
    if (fs.existsSync(configFile)) fs.unlinkSync(configFile)

    const localeDir = path.join(tmpDir, 'locale')
    if (fs.existsSync(localeDir)) {
        fs.readdirSync(localeDir).forEach((file) => {
            try { fs.unlinkSync(path.join(localeDir, file)) } catch (e) {}
        })
    }

    process.chdir(tmpDir)
    jest.resetModules()

    const axiosFactory = jest.fn()
    jest.doMock('axios', () => axiosFactory)
    jest.doMock('ora', () =>
        jest.fn(() => ({
            start: jest.fn().mockReturnThis(),
            fail: jest.fn().mockReturnThis(),
            succeed: jest.fn().mockReturnThis(),
        }))
    )

    mockCreateChatCompletion = jest.fn()
    jest.doMock('openai', () => ({
        Configuration: jest.fn(),
        OpenAIApi: jest.fn().mockImplementation(() => ({
            createChatCompletion: mockCreateChatCompletion,
        })),
    }))

    axiosMock = require('axios')
    translate = require('../../lib/translate')
})

afterEach(() => {
    process.chdir(originalCwd)
})

describe('配置文件检测', () => {
    test('i18n-config.js 不存在时应提前退出，不调用翻译 API', async () => {
        await translate('en')
        expect(axiosMock).not.toHaveBeenCalled()
    })

    test('源语言文件（zh.js）不存在时应提前退出，不调用翻译 API', async () => {
        setupConfig()
        await translate('en')
        expect(axiosMock).not.toHaveBeenCalled()
    })
})

describe('百度翻译', () => {
    test('翻译成功时应生成目标语言文件及 map 文件', async () => {
        setupConfig()
        setupLocale({ greeting: '你好', world: '世界' })

        axiosMock.mockResolvedValue({
            data: {
                trans_result: [
                    { src: '你好', dst: 'hello' },
                    { src: '世界', dst: 'world' },
                ],
            },
        })

        await translate('en')

        const outputJs = path.join(tmpDir, 'locale', 'en.js')
        const outputMap = path.join(tmpDir, 'locale', 'en.js.map')
        expect(fs.existsSync(outputJs)).toBe(true)
        expect(fs.existsSync(outputMap)).toBe(true)

        const output = readOutput('en.js')
        expect(output.greeting).toBe('Hello')
        expect(output.world).toBe('World')
    }, 10000)

    test('翻译 API 返回 error_code 时不应写入目标文件', async () => {
        setupConfig()
        setupLocale({ greeting: '你好' })

        axiosMock.mockResolvedValue({
            data: { error_code: 52001, error_msg: 'timeout' },
        })

        await translate('en')

        expect(fs.existsSync(path.join(tmpDir, 'locale', 'en.js'))).toBe(false)
    }, 10000)

    test('翻译 API 网络错误时函数应抛出异常', async () => {
        setupConfig()
        setupLocale({ greeting: '你好' })

        axiosMock.mockRejectedValue(new Error('Network Error'))

        await expect(translate('en')).rejects.toThrow('Network Error')
    }, 10000)

    test('已全部翻译完成时不应再次调用翻译 API', async () => {
        setupConfig()
        setupLocale({ greeting: '你好', world: '世界' })
        setupLocale({ greeting: 'Hello', world: 'World' }, 'en.js')

        await translate('en')

        expect(axiosMock).not.toHaveBeenCalled()
        expect(fs.existsSync(path.join(tmpDir, 'locale', 'en.js'))).toBe(true)
    }, 10000)

    test('目标语言为非 en 时翻译结果不做大小写转换', async () => {
        setupConfig({ distLangs: ['zh-TW'] })
        setupLocale({ greeting: '你好' })

        axiosMock.mockResolvedValue({
            data: {
                trans_result: [{ src: '你好', dst: '你好(繁)' }],
            },
        })

        await translate('zh-TW')

        const outputPath = path.join(tmpDir, 'locale', 'zh-TW.js')
        expect(fs.existsSync(outputPath)).toBe(true)

        const output = readOutput('zh-TW.js')
        expect(output.greeting).toBe('你好(繁)')
    }, 10000)
})

describe('singleNum 边界处理', () => {
    test('singleNum 超出上限 3900 时自动限制为 3900，翻译仍正常完成', async () => {
        setupConfig({ singleNum: 9999 })
        setupLocale({ key1: '你好' })

        axiosMock.mockResolvedValue({
            data: { trans_result: [{ src: '你好', dst: 'hello' }] },
        })

        await translate('en')

        expect(fs.existsSync(path.join(tmpDir, 'locale', 'en.js'))).toBe(true)
    }, 10000)

    test('singleNum 低于下限 600 时自动限制为 600，翻译仍正常完成', async () => {
        setupConfig({ singleNum: 10 })
        setupLocale({ key1: '你好' })

        axiosMock.mockResolvedValue({
            data: { trans_result: [{ src: '你好', dst: 'hello' }] },
        })

        await translate('en')

        expect(fs.existsSync(path.join(tmpDir, 'locale', 'en.js'))).toBe(true)
    }, 10000)
})

describe('分段翻译', () => {
    test('内容超出 singleNum 时应分批调用翻译 API', async () => {
        setupConfig({ singleNum: 600 })

        // 每个文本超过 600 字符，确保触发分段逻辑
        const longText1 = '这是第一条超长测试文本用于验证分段翻译功能。'.repeat(30)  // ~630 chars
        const longText2 = '这是第二条超长测试文本用于验证分段翻译功能。'.repeat(30)  // ~630 chars

        setupLocale({ key0: longText1, key1: longText2 })

        axiosMock.mockResolvedValue({
            data: {
                trans_result: [{ src: longText1, dst: 'translated1' }],
            },
        })

        await translate('en')

        expect(axiosMock.mock.calls.length).toBeGreaterThan(1)
    }, 30000)
})

describe('chatGPT 模式', () => {
    test('chatGPT 翻译成功时应生成目标语言文件', async () => {
        setupConfig({ mode: 'chatGPT', openAiKey: 'test-key' })
        setupLocale({ greeting: '你好' })

        mockCreateChatCompletion.mockResolvedValue({
            data: {
                choices: [{ message: { content: '{"greeting":"Hello"}' } }],
            },
        })

        await translate('en')

        expect(fs.existsSync(path.join(tmpDir, 'locale', 'en.js'))).toBe(true)
    }, 15000)

    test('chatGPT API 抛出异常时函数应正常结束（不崩溃）', async () => {
        setupConfig({ mode: 'chatGPT', openAiKey: 'test-key' })
        setupLocale({ greeting: '你好' })

        mockCreateChatCompletion.mockRejectedValue(new Error('API Error'))

        await expect(translate('en')).resolves.not.toThrow()
    }, 15000)
})

describe('filename 参数', () => {
    test('传入 filename 时输出文件名应带语种前缀（en-zh.js）', async () => {
        setupConfig()
        setupLocale({ greeting: '你好' })

        axiosMock.mockResolvedValue({
            data: { trans_result: [{ src: '你好', dst: 'hello' }] },
        })

        await translate('en', 'zh.js')

        expect(fs.existsSync(path.join(tmpDir, 'locale', 'en-zh.js'))).toBe(true)
    }, 10000)

    test('filename 不带扩展名时应自动补全 .js 后缀', async () => {
        setupConfig()
        setupLocale({ greeting: '你好' })

        axiosMock.mockResolvedValue({
            data: { trans_result: [{ src: '你好', dst: 'hello' }] },
        })

        await translate('en', 'zh')

        expect(fs.existsSync(path.join(tmpDir, 'locale', 'en-zh.js'))).toBe(true)
    }, 10000)
})

describe('多语言同时翻译', () => {
    test('distLangs 含多个目标语言时应各自调用翻译 API', async () => {
        setupConfig({ distLangs: ['en', 'ja'] })
        setupLocale({ greeting: '你好' })

        axiosMock.mockResolvedValue({
            data: { trans_result: [{ src: '你好', dst: 'translated' }] },
        })

        await translate('en')

        expect(axiosMock.mock.calls.length).toBe(2)
        expect(fs.existsSync(path.join(tmpDir, 'locale', 'en.js'))).toBe(true)
        expect(fs.existsSync(path.join(tmpDir, 'locale', 'ja.js'))).toBe(true)
    }, 20000)

    test('code 不在 distLangs 中时应自动添加到翻译列表', async () => {
        setupConfig({ distLangs: ['en'] })
        setupLocale({ greeting: '你好' })

        axiosMock.mockResolvedValue({
            data: { trans_result: [{ src: '你好', dst: 'translated' }] },
        })

        await translate('fr')

        expect(axiosMock.mock.calls.length).toBe(2)
        expect(fs.existsSync(path.join(tmpDir, 'locale', 'fr.js'))).toBe(true)
        expect(fs.existsSync(path.join(tmpDir, 'locale', 'en.js'))).toBe(true)
    }, 20000)
})

