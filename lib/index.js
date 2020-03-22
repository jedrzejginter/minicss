const { readFileSync, writeFileSync, mkdirSync, existsSync } = require("fs");
const { dirname, join } = require('path');

const { escapeClassName, formatCalc, hexToRgb, makeRule, makeSelector, ungroupCssVal } = require('./core');
const { parseFnClassName } = require('./parser');
const { extractor } = require('./extractor');
const { mapState } = require('./state');
const { reverseProp } = require('./property');
const { mapBreakpoint } = require('./media');
const { reverseVal } = require('./value');
const { extractFromClassNames, makeCssStyles } = require('./stylesheet');
const { decorateCssVal } = require('./css-value');

let bucket = {};

function extractRules(bucket, queue) {
  const extraBucket = {};
  let hadAnyMutation = false;

  for (const cn of queue) {
    const extr = extractFromClassNames(cn);

    for (const obj of extr) {
      if (obj.className in bucket) {
        continue;
      }

      hadAnyMutation = true;
      extraBucket[obj.className] = obj;
    }
  }

  return { bucket: extraBucket, hadAnyMutation }
}

let performedAnyWrite = false;

function ejectBucketToCss(bucket, filename) {
  const css = [];

  for (const k in bucket) {
    css.push(makeCssStyles(bucket[k]));
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

    ejectBucketToCss(bucket, queueCacheOut);
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
          const { bucket: extraBucket, hadAnyMutation } = extractRules(bucket, queue);
          bucket = Object.assign({}, bucket, extraBucket);

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
