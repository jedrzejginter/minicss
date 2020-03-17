const { createMacro } = require('babel-plugin-macros');
const {  clearModifier, makeCssVal, processClassName } = require('./helpers');

module.exports = createMacro(myMacro);
function myMacro({ references, state, babel }) {
  const { default: defaultImport = [] } = references;

  defaultImport.forEach(({ node, parentPath }) => {
    const args = parentPath.get("arguments");
    const arg0 = args[0];

    const { quasis } = arg0.node;
    const allCooked = quasis
      .map(({ value }) => value.cooked)
      .join(" ")
      .replace(/\s{2,}/, " ");

    allCooked.split(" ").forEach(x => console.log(JSON.stringify(processClassName(x))));
  });
}
