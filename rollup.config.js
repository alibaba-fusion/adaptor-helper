import babel from 'rollup-plugin-babel';
import resolve from "rollup-plugin-node-resolve";

const input = 'src/index.ts';
const name = 'AdaptorHelper';
const filename = 'adaptor-helper';
const globals = {};

const babelOptions = {
  exclude: /node_modules/,
  // We are using @babel/plugin-transform-runtime
  runtimeHelpers: false,
  configFile: './babel.config.js',
  extensions: ['js', 'jsx', '.ts', '.tsx'],
};


export default [{
  input,
  output: {
    file: `umd/${filename}.js`,
    format: 'umd',
    name,
    globals,
  },
  external: Object.keys(globals),
  plugins: [
    resolve({
      jsnext: true,
      extensions: babelOptions.extensions,
    }),
    babel(babelOptions)
  ]
}, {
  input,
  output: {
    file: `es/${filename}.js`,
    format: 'esm'
  },
  external: Object.keys(globals),
  plugins: [
    resolve({
      jsnext: true,
      extensions: babelOptions.extensions,
    }),
    babel(babelOptions)
  ]
}];
