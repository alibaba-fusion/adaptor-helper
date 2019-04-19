module.exports = {
  presets:[
    [
      '@babel/preset-env',
      ['es', 'production-umd'].includes(process.env.BABEL_ENV) ? {
        modules: false,
      } : {}
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    "@babel/proposal-object-rest-spread"
  ],
};
