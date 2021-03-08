module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: false,
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '<rootDir>/dist/'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '<rootDir>/dist/'],
}
