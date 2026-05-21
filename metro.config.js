const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// These packages have "react-native": "src/index.tsx" in their package.json.
// Metro on Windows fails to resolve TypeScript source from node_modules.
// We redirect each import to its pre-compiled CommonJS output, using
// context.resolveRequest (not a raw filePath) so Metro's own file watcher
// tracks the resolved file — avoiding SHA-1 / not-watched errors.
const COMMONJS_REDIRECTS = {
  'react-native-screens':           'react-native-screens/lib/commonjs/index.js',
  '@react-navigation/native':       '@react-navigation/native/lib/commonjs/index.js',
  '@react-navigation/native-stack': '@react-navigation/native-stack/lib/commonjs/index.js',
  '@react-navigation/bottom-tabs':  '@react-navigation/bottom-tabs/lib/commonjs/index.js',
  '@react-navigation/core':         '@react-navigation/core/lib/commonjs/index.js',
  '@react-navigation/routers':      '@react-navigation/routers/lib/commonjs/index.js',
  'react-native-safe-area-context': 'react-native-safe-area-context/lib/commonjs/index.js',
  'react-native-svg':               'react-native-svg/lib/commonjs/index.js',
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const redirect = COMMONJS_REDIRECTS[moduleName];
  if (redirect) {
    return context.resolveRequest(context, redirect, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
