module.exports = {
  testEnvironment: 'node', 
  testMatch: ['**/src/tests/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],  
  transformIgnorePatterns: ['node_modules/(?!(some-module))'], 
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
};
