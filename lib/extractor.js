const { ungroupCssVal } = require('./core');
const { parseFnClassName } = require('./parser');
const { reverseProp } = require('./property');
const { mapState } = require('./state');
const { mapBreakpoint } = require('./media');
const { reverseVal } = require('./value');
const { decorateCssVal } = require('./css-value');

module.exports.extractor = function extractor(c) {
  const parsed = parseFnClassName(c);

  if (!parsed) {
    return null;
  }

  const valsGrps = ungroupCssVal(parsed.value);
  const revprops = reverseProp(parsed.property);

  function doVals(valsGrps) {
    return valsGrps.map((group) => {
      return group
        .split(',')
        .map((singleVal) => {
          const revVal = reverseVal(singleVal, revprops);
          return decorateCssVal(revVal, revprops);
        })
        .join(' ')
    });
  }

  return {
    className: c,
    state: parsed.state ? mapState(parsed.state) : null,
    properties: Array.isArray(revprops) ? revprops : [revprops],
    media: parsed.media ? mapBreakpoint(parsed.media) : null,
    values: doVals(valsGrps)
  };
}
