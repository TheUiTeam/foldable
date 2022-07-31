module.exports = {
  preset: 'ts-jest',
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  moduleNameMapper: {
    '\\.(s?css|less)$': 'identity-obj-proxy',
  },
};
