const { escapeClassName, makeSelector, makeRule } = require('./core');
const { extractor } = require('./extractor');

function makeCssStyles(o) {
  const cn = escapeClassName(o.className);
  return makeSelector({ ...o, className: cn }) + '{' + makeRule(o) + '}'
}

module.exports.makeCssStyles = makeCssStyles;

module.exports.extractFromClassNames = function extractFromClassNames(c) {
  return c.trim().split(" ").map(x => extractor(x)).filter(Boolean)
}
