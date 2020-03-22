const { readFileSync, writeFileSync, mkdirSync, existsSync } = require("fs");
const { dirname, join } = require('path');

const { escapeClassName, formatCalc, hexToRgb, makeRule, makeSelector, ungroupCssVal } = require('./core');
const { parseFnClassName } = require('./parser');

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
  Pos: 'position',
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
  b: (p) => p === 'font-weight' ? 'bold' : 'bottom',
  c: (p) => /^font(\-.+)?$/.test(p) ?  'condensed' : 'center',
  fe: () => "flex-end",
  i: (p) => p === 'font-style' ? 'italic' : 'inherit',
  n: p => (p === "background-repeat" ? "no-repeat" : "none"),
  nr: () => "no-repeat",
  r: (p) => p === 'position' ? 'relative' : 'right',
  s: p => /^border(\-.+)?$/.test(p) ? "solid" : "start",
  st: () => "stretch",
};

const mediaMapObject = {
  xs: '375px',
  sm: '425px',
  md: '768px',
  lg: '1024px',
  xl: '1440px',
};

function reverseProp(p) {
  return propMapObject[p] || "unknown";
}

function reverseVal(p, v) {
  return valMapObject[v] ? valMapObject[v](p) : v;
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
    const { r, g, b } = hexToRgb(hex);

    return "rgba(" + [r,g,b,"0."+a].join(",") + ")";
  }

  if (/^..+[\+\-]/.test(v)) {
    return `calc(${formatCalc(v)})`;
  }

  return v;
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

function extractor(c) {
  const parsed = parseFnClassName(c);

  if (!parsed) {
    return null;
  }

  // const m = matched.slice(1);
  // const cssProp = reverseProp(parsed.property);
  const valsGrps = parsed.value ? ungroupCssVal(parsed.value) : [];
  const revprops = reverseProp(parsed.property);

  return {
    rawClassName: c,
    className: escapeClassName(c),
    state: parsed.state ? mapState(parsed.state) : undefined,
    properties: Array.isArray(revprops) ? revprops : [revprops],
    breakpoint: parsed.media ? mediaMapObject[parsed.media] : undefined,
    values: valsGrps.map(g =>
      g
        .split(",")
        .map(v => decorateCssVal(reverseVal(revprops, v), revprops))
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
