module.exports.clearModifier = clearModifier;
function clearModifier(m) {
  return m.replace(/\:/g, "");
}

module.exports.makeCssVal = makeCssVal;
function makeCssVal(v) {
  if (/^-?\d+$/.test(v)) {
    return parseInt(v, 10);
  }

  if (/[+*\-\/()]/.test(v)) {
    return `calc(${v.replace(/([+*\-\/()])/g, " $1 ")})`;
  }

  return v;
}

module.exports.processClassName = processClassName;
function processClassName(c) {
  const m = c.match(/^(>[a-z0-9]\:)?([a-zA-Z]+)\(([^\s]+)\)(\:[a-z]+)?$/);

  if (!m) {
    return null;
  }

  return {
    raw: c,
    media: m[1] && clearModifier(m[1]),
    prop: m[2],
    val: m[3],
    valcss: makeCssVal(m[3]),
    state: m[4] && clearModifier(m[4])
  };
}
