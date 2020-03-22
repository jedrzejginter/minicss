module.exports.parseFnClassName = function(c) {
  const matched = c.match(/^([a-z]{1,2}\:)?([A-Z][a-z]*)\(([^)]+)\)(\:[a-z]{1,2})?$/);

  if (!matched) {
    return null;
  }

  // Ignore whole match.
  const m = matched.slice(1);

  return {
    media: m[0] ? m[0].replace(':', '') : undefined,
    property: m[1],
    value: m[2],
    state: m[3] ? m[3].replace(':', '') : undefined,
  };
};
