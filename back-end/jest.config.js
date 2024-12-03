module.exports = {
  testEnvironment: 'node', 
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],  
  testPathIgnorePatterns: ['/node_modules/', '/dist/'], 
  verbose: true,
};
