const statesMapObject = {
  a: "active",
  c: "checked",
  d: "disabled",
  e: "empty",
  f: "focus",
  h: "hover",
  v: "visited",
};

module.exports.statesMapObject = statesMapObject;

module.exports.mapState = function mapState(s) {
  return statesMapObject[s.replace(':', '')] || "default";
};
