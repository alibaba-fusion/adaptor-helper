module.exports = {
  verbose: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testURL: 'http://localhost/',
  roots: [
    '<rootDir>/src',
  ],
  moduleDirectories: [
    'node_modules',
  ],
  transformIgnorePatterns: [
    'node_modules/[^/]+?/(?!(es|node_modules)/)',
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts'
  ],
};
