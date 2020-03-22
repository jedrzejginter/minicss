const { formatCalc, hexToRgb } = require('./core');

module.exports.decorateCssVal = function decorateCssVal(v, p) {
  if (/^-?\d+(\.\d+)?$/.test(v)) {
    const num = parseFloat(v, 10);

    if (['z-index', 'order', 'flex-grow', 'flex-shrink'].includes(p)) {
      return num.toString();
    }

    return num === 0 ? "0" : `${num / 16}rem`;
  }

  if (/^(0x|#)([0-9a-f]{3}){1,2}$/.test(v)) {
    return "#" + (v.startsWith('#') ? v.slice(1) : v.slice(2));
  }

  if (/^(0x|#)([0-9a-f]{3}){1,2}\.\d{1,3}$/i.test(v)) {
    const [vhex, a] = v.split('.');
    const hex = vhex.startsWith('#') ? vhex.slice(1) : vhex.slice(2);
    const { r, g, b } = hexToRgb(hex);

    return "rgba(" + [r,g,b,"0."+a].join(",") + ")";
  }

  if (/^.+[\[\]\*\+\-\/]/.test(v) && /\d/.test(v)) {
    return `calc(${formatCalc(v)})`;
  }

  return v;
}
