export default {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'src',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
  
    // 👇 This is the important part for fixing your path errors:
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/$1',
    },
  };
  