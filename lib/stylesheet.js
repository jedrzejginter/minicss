const { escapeClassName, makeSelector, makeRule } = require('./core');
const { extractor } = require('./extractor');

function makeCssStyles(o) {
  const cn = escapeClassName(o.className);
  return makeSelector({ ...o, className: cn }) + '{' + makeRule(o) + '}'
}

module.exports.makeCssStyles = makeCssStyles;

function makeCssForFnClassName(c) {
  const e = extractor(c);

  if (!e) {
    return null;
  }

  return makeCssStyles(e);
}

module.exports.makeCssForFnClassName = makeCssForFnClassName;

module.exports.extractFromClassNames = function extractFromClassNames(c) {
  return c.trim().split(" ").map(x => extractor(x)).filter(Boolean)
}
