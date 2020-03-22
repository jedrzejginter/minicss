const mediaMapObject = {
  xs: '375px',
  sm: '425px',
  md: '768px',
  lg: '1024px',
  xl: '1440px',
};

module.exports.mediaMapObject = mediaMapObject;

module.exports.mapBreakpoint = function mapBreakpoint(x, c = {}) {
  return c[x] || mediaMapObject[x] || null;
}
