module.exports = {
  presets: ['module:@react-native/babel-preset'],
  env: {
    development: {
      plugins: ['react-native-reanimated/plugin'],
    },
    production: {
      plugins: ['react-native-paper/babel', 'react-native-reanimated/plugin'],
    },
  },
};
