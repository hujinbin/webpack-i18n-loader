const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname, './'),
  moduleFileExtensions: [
    'js',
    'json',
    'vue'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest'
  },
  testPathIgnorePatterns: [
    '<rootDir>/test'
  ],
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  setupFiles: ['<rootDir>/test/setup'],
  mapCoverage: true,
  coverageDirectory: '<rootDir>/test/coverage',
  collectCoverage: true,
  collectCoverageFrom: [
    // 'src/**/*.{js,vue}',
    // '!src/main.js',
    // '!**/node_modules/**'
    'test/.{js,vue}',
  ]
}
