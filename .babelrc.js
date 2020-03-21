module.exports = {
  presets: [],
  plugins: [
    'syntax-jsx',
    ['./lib/index.js', { output: 'out/styles.json' }],
  ],
};
