module.exports = {
  clearMocks: true,
  preset: "@vue/cli-plugin-unit-jest",
  moduleFileExtensions: ['js', 'vue'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
    '^.+\\.js$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  snapshotSerializers: ['jest-serializer-vue'],
  testMatch: [
    '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'
  ],
  collectCoverageFrom: [
  '!**/{node_modules,build,dist,public,docker)/**/*.*',
  '!src/utils/**/*.{js,vue}',
  'src/components/**/*.{js,vue}'],
  coverageDirectory: '<rootDir>/tests/coverage',
  collectCoverage: true,
  coverageReporters: [
    'lcov',
    'text',
    'text-summary'
  ],
  testURL: 'http://localhost/'
}