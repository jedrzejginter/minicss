const { readFileSync, writeFileSync, mkdirSync, existsSync } = require("fs");
const { dirname, join } = require('path');

const acc = [];

const cache = {};

const propMapObject = {
  Ap: ["-moz-appearance", "-webkit-appearance", "appearance"],
  Ai: "align-items",
  Bd: "border",
  Bgc: 'background-color',
  Bgi: "background-image",
  Bxsh: "box-shadow",
  C: "color",
  Jc: "justify-content",
  Justify: "justify-content",
  Bdc: "border-color",
  Bds: "border-style",
  Bgr: "background-repeat",
  Bdrs: 'border-radius',
  T: "top",
  W: "width",
  M: "margin",
  P: 'padding',
  Px: ["padding-left", "padding-right"],
  Op: 'opacity',
  Ord: 'order',
  Ff: 'font-family',
  Fz: 'font-size',
  Fs: 'font-style',
  F: 'font',
  Fw: 'font-weight',
  Z: 'z-index',
  Fxg: 'flex-grow',
};

const valMapObject = {
  "sh-long": () => "inset 0 0 6rem yellow, 0 0 9 aqua-marine",
  b: (p) => p === 'font-weight' ? 'bold' : 'bottom',
  fe: () => "flex-end",
  s: p => /^border(\-.+)?$/.test(p) ? "solid" : "start",
  st: () => "stretch",
  n: p => (p === "background-repeat" ? "no-repeat" : "none"),
  nr: () => "no-repeat",
  c: (p) => /^font(\-.+)?$/.test(p) ?  'condensed' : 'center',
  i: (p) => p === 'font-style' ? 'italic' : 'inherit',
  dropdown: () => 9,
};

const mediaMapObject = {
  sm: '425px',
};

function reverseProp(p) {
  return propMapObject[p] || "unknown";
}

function reverseVal(p, v) {
  return valMapObject[v] ? valMapObject[v](p) : v;
}

const syntaxRegexMapObject = {
  atomic: /^([a-z]{1,2}\:)?([A-Z][a-z]*)\(([^)]+)\)(\:[a-z]{1,2})?$/
  //tailwind: /^([a-z][a-z\-]*[a-z])\-([a-z]+)$/,
};

function formatCalc(x) {
  return x
    // .replace(/([^\*x\/])?(\d+)([^\depr\%])?/g, '$1$2rem$3')
    .replace(/([\-\+\[\]\*])/g, " $1 ")
    .replace(/\[\s?/, "(")
    .replace(/\s?\]/, ")")
    .replace(/^\s\-\s?/, "-")
    .replace(/([^p])x/g, "$1 * ")
    .replace(/\s{2,}/, " ")
    .trim();
}

function decorateCssVal(v, p) {
  if (/^-?\d+$/.test(v)) {
    const num = parseInt(v, 10);

    if (['z-index', 'order', 'flex-grow', 'flex-shrink'].includes(p)) {
      return num;
    }

    return num === 0 ? 0 : `${num / 16}rem`;
    // return num === 0 ? 0 : `${num}px`;
  }

  if (/^0x([0-9a-f]{3}){1,2}$/.test(v)) {
    return "#" + v.slice(2);
  }

  if (/^0x([0-9a-f]{3}){1,2}\.\d{1,3}$/i.test(v)) {
    const [vhex, a] = v.split('.');
    const hex = vhex.slice(2);
    // f4a -> ff44aa
    const hex6 = hex.length === 3 ? hex.split('').map((v) => v+v) : hex;
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return "rgba(" + [r,g,b,"0."+a].join(",") + ")";
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
  return c.replace(/([^\da-z_\-])/gi, "\\$1");
}

const statesMapObject = {
  h: "hover",
  e: "empty",
  a: "active",
  v: "visited",
  d: "disabled",
  c: "checked"
};

function mapState(s) {
  return statesMapObject[s.slice(1)] || "default";
}

function makeSelector(o) {
  let stateSuffix = '';

  if (o.state && o.state !== 'default') {
    stateSuffix = ':' + o.state;
  }

  return '.' + o.className + stateSuffix;
}

function makeRule(o) {
  const v = o.values.join(',');
  return o.properties.map((p) => p + ':' + v).join(';')
}

function extractor(c, stx = "atomic") {
  const matched = c.match(syntaxRegexMapObject[stx]);
  if (!matched) {
    return null;
  }
  const m = matched.slice(1);
  const media = m[0];
  const cssProp = reverseProp(m[1]);
  const valsGrps = m[2] ? ungroupCssVal(m[2]) : [];
  const revprops = reverseProp(m[1]);

  return {
    rawClassName: c,
    className: escapeClassName(c),
    state: m[3] ? mapState(m[3]) : 'default',
    properties: Array.isArray(revprops) ? revprops : [revprops],
    breakpoint: media ? mediaMapObject[media.replace(':', '')] : null,
    values: valsGrps.map(g =>
      g
        .split(",")
        .map(v => decorateCssVal(reverseVal(cssProp, v), cssProp))
        .join(" ")
    )
  };
}

let bucket = {};

function propagateBucket(queue) {
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

  return { hadAnyMutation }
}

let performedAnyWrite = false;

function ejectBucketToCss(bucket, filename) {
  const css = [];

  for (const k in bucket) {
    css.push(makeSelector(bucket[k]) + '{' + makeRule(bucket[k]) + '}');
  }

  writeFileSync(output, css.join('\n'), 'utf-8');
  writeFileSync(queueCacheOut, JSON.stringify(bucket), 'utf-8')
  performedAnyWrite = true;
}

const output = "css/styles.css";
const queueCacheOut = join(__dirname, '.cache/queue.json');

if (!existsSync(output)) {
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, '', 'utf-8');
}

if (existsSync(queueCacheOut)) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      const cachedQueue = readFileSync(queueCacheOut, 'utf-8');
      const cachedQueueJson = JSON.parse(cachedQueue);

      bucket = cachedQueueJson;
    }

    ejectBucketToCss(bucket, 'GLOBAL');
  } catch {
    // ignore
  }
} else {
  mkdirSync(dirname(queueCacheOut), { recursive: true });
}

module.exports = function({ types: t }) {
  let queue = [];

  return {
    name: "babel-plugin-crown-css",
    visitor: {
      Program: {
        enter() {
					queue = [];
				},
        exit(path, state) {
          const { hadAnyMutation } = propagateBucket(queue);

          if (hadAnyMutation || !performedAnyWrite) {
            ejectBucketToCss(bucket, this.file.opts.filename);
          }
        }
      },
      JSXAttribute(path) {
        if (path.node.name.name !== "className") {
          return;
        }

        const val = path.node.value.value;

        queue.push(val);
      }
    }
  };
};
