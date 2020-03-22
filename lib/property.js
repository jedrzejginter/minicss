// We are defining as functions to get correct code coverage.
const propMapObject = {
  Ai: () => "align-items",
  Ap: () => ["-moz-appearance", "-webkit-appearance", "appearance"],
  Bd: () => "border",
  Bdc: () => "border-color",
  Bdrs: () => 'border-radius',
  Bds: () => "border-style",
  Bgc: () => 'background-color',
  Bgi: () => "background-image",
  Bgr: () => "background-repeat",
  Bxsh: () => "box-shadow",
  C: () => "color",
  F: () => 'font',
  Ff: () => 'font-family',
  Fs: () => 'font-style',
  Fw: () => 'font-weight',
  Fxg: () => 'flex-grow',
  Fz: () => 'font-size',
  Jc: () => "justify-content",
  Justify: () => "justify-content",
  M: () => "margin",
  Op: () => 'opacity',
  Ord: () => 'order',
  P: () => 'padding',
  Pos: () => 'position',
  Px: () => ["padding-left", "padding-right"],
  T: () => "top",
  W: () => "width",
  Z: () => 'z-index',
};

module.exports.propMapObject = propMapObject;

module.exports.reverseProp = function reverseProp(p) {
  const fn = propMapObject[p];

  if (!fn) {
    return 'unknown';
  }

  return fn();
};
