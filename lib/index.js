const { readFileSync, writeFileSync, mkdirSync, existsSync } = require("fs");
const { dirname, join } = require('path');

const { extractFromClassNames, makeCssStyles } = require('./stylesheet');

let OUTPUT_PATH = "css/styles.css";
const CACHE_PATH = join(__dirname, `.cache/${createCacheFilename(process.cwd())}.json`);

const PKG_JSON_PATH = join(process.cwd(), 'package.json');

if (existsSync(PKG_JSON_PATH)) {
  const pkgJson = require(PKG_JSON_PATH);

  if (pkgJson && pkgJson.minicss) {
    if (pkgJson.minicss.output) {
      OUTPUT_PATH = pkgJson.minicss.output;
    }
  }
}

function createCacheFilename(x) {
  return x.replace(/[^a-z0-9+=@_\.\-]/gi, '-');
}

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

  writeFileSync(OUTPUT_PATH, css.join('\n'), 'utf-8');
  writeFileSync(CACHE_PATH, JSON.stringify(bucket), 'utf-8')
  performedAnyWrite = true;
}

if (!existsSync(OUTPUT_PATH)) {
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, '', 'utf-8');
}

if (existsSync(CACHE_PATH)) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      const cachedQueue = readFileSync(CACHE_PATH, 'utf-8');
      const cachedQueueJson = JSON.parse(cachedQueue);

      bucket = cachedQueueJson;
    }

    ejectBucketToCss(bucket, CACHE_PATH);
  } catch {}
} else {
  mkdirSync(dirname(CACHE_PATH), { recursive: true });
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
