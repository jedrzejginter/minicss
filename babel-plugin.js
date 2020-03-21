const { readFileSync, writeFileSync } = require("fs");

const acc = [];

const cache = {};

const propMapObject = {
  Ap: "appearance",
  Ai: "align-items",
  Bd: "border",
  Bgi: "background-image",
  Bxsh: "box-shadow",
  C: "color",
  Jc: "justify-content",
  Justify: "justify-content",
  Bdc: "border-color",
  Bds: "border-style",
  Bgr: "background-repeat",
  T: "top",
  W: "width",
  M: "margin"
};

const valMapObject = {
  "sh-long": () => "inset 0 0 6rem yellow, 0 0 9 aqua-marine",
  fe: () => "flex-end",
  s: p => (/^border(\-.+)?$/.test(p) ? "solid" : "start"),
  st: () => "stretch",
  n: p => (p === "background-repeat" ? "no-repeat" : "none"),
  nr: () => "no-repeat"
};

function reverseProp(p) {
  return propMapObject[p] || "unknown";
}

function reverseVal(p, v) {
  return valMapObject[v] ? valMapObject[v](p) : v;
}

const syntaxRegexMapObject = {
  atomic: /^([A-Z][a-z]*)\(([^)]+)\)(\:[h])?$/
  //tailwind: /^([a-z][a-z\-]*[a-z])\-([a-z]+)$/,
};

function formatCalc(x) {
  return x
    .replace(/([\-\+\[\]\*])/g, " $1 ")
    .replace(/\[\s?/, "(")
    .replace(/\s?\]/, ")")
    .replace(/^\s\-\s?/, "-")
    .replace(/([^p])x/g, "$1 * ")
    .replace(/\s{2,}/, " ")
    .trim();
}

function decorateCssVal(v) {
  if (/^\d+$/.test(v)) {
    const num = parseInt(v, 10);
    // return num === 0 ? 0 : `${num / 16}rem`;
    return num === 0 ? 0 : `${num}px`;
  }

  if (/^0x([0-9a-f]{3}){1,2}$/.test(v)) {
    return "#" + v.slice(2);
  }

  if (/^..+[\+\-]/.test(v)) {
    return `calc(${formatCalc(v)})`;
  }

  return v;
}

function ungroupCssVal(v) {
  return v.split("/").map(x => x.trim());
}

function escapeClassName(c) {
  return c.replace(/([^\da-z_\-])/g, "\\$1");
}

function extractor(c, stx = "atomic") {
  const matched = c.match(syntaxRegexMapObject[stx]);
  if (!matched) {
    return null;
  }
  const m = matched.slice(1);
  const cssProp = reverseProp(m[0]);
  const valsGrps = m[1] ? ungroupCssVal(m[1]) : [];

  return {
    rawClassName: c,
    className: escapeClassName(c),
    property: reverseProp(m[0]),
    values: valsGrps.map(g =>
      g
        .split(",")
        .map(v => decorateCssVal(reverseVal(cssProp, v)))
        .join(" ")
    )
  };
}

const bucket = {};

module.exports = function(babel, opts = {}) {
  const { types: t } = babel;
  const { enabled = true } = opts;
  let queue = [];

  const base = {
    name: "ast-transform",
  };

  if (!enabled) {
    return base;
  }

  return {
    ...base,
    visitor: {
      Program: {
        enter() {
					queue = [];
				},
        exit(path, state) {
          let hadAnyMutation = false;

          for (const val of queue) {
            const mappedVals = val.split(" ").map(x => extractor(x, "atomic"));

            for (const mv of mappedVals) {
              if (mv.rawClassName in bucket) {
                continue;
              }

              hadAnyMutation = true;
              bucket[mv.rawClassName] = mv;
            }
          }

          if (hadAnyMutation) {
            writeFileSync('./css.json', JSON.stringify(bucket, null, 2), 'utf-8');
            console.log('Done:', this.file.opts.filename);
          } else {
            console.log('Nothing to do for:', this.file.opts.filename);
          }
        }
      },
      JSXAttribute(path) {
        if (path.node.name.name !== "className") {
          return;
        }

        const val = path.node.value.value;

        // if (!(val in cache)) {
        //   const mappedVals = val.split(" ").map(x => extractor(x, "atomic"));
        //   cache[val] = JSON.stringify(mappedVals, null, 2);
        // }

        queue.push(val);

        // console.log(cache[val]);
      }
    }
  };
};
