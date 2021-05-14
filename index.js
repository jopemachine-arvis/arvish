'use strict';
const os = require('os');
const Conf = require('conf');
const got = require('got');
const hookStd = require('hook-std');
const loudRejection = require('loud-rejection');
const cleanStack = require('clean-stack');
const dotProp = require('dot-prop');
const CacheConf = require('cache-conf');

const arvis = module.exports;

arvis.input = process.argv[2];

arvis.output = (items, { rerunInterval, variables } = {}) => {
  console.log(
    JSON.stringify({ items, rerun: rerunInterval, variables }, null, '\t')
  );
};

arvis.matches = (input, list, item) => {
  input = input.toLowerCase().normalize();

  return list.filter((x) => {
    if (typeof item === 'string') {
      x = dotProp.get(x, item);
    }

    if (typeof x === 'string') {
      x = x.toLowerCase();
    }

    if (typeof item === 'function') {
      return item(x, input);
    }

    return x.includes(input);
  });
};

arvis.inputMatches = (list, item) => arvis.matches(arvis.input, list, item);

arvis.log = (text) => {
  console.error(text);
};

arvis.error = (error) => {
  const stack = cleanStack(error.stack || error);

  const copy = `
\`\`\`
${stack}
\`\`\`

-
${arvis.meta.name} ${arvis.meta.version}
Alfred ${arvis.alfred.version}
${process.platform} ${os.release()}
	`.trim();

  arvis.output([
    {
      title: error.stack ? `${error.name}: ${error.message}` : error,
      subtitle: 'Press ⌘L to see the full error and ⌘C to copy it.',
      valid: false,
      text: {
        copy,
        largetype: stack,
      },
      icon: {
        path: exports.icon.error,
      },
    },
  ]);
};

arvis.config = new Conf({
  cwd: arvis.alfred.data,
});

arvis.cache = new CacheConf({
  configName: 'cache',
  cwd: arvis.alfred.cache,
  version: arvis.meta.version,
});

arvis.fetch = async (url, options) => {
  options = {
    json: true,
    ...options,
  };

  if (typeof url !== 'string') {
    return Promise.reject(
      new TypeError(
        `Expected \`url\` to be a \`string\`, got \`${typeof url}\``
      )
    );
  }

  if (options.transform && typeof options.transform !== 'function') {
    return Promise.reject(
      new TypeError(
        `Expected \`transform\` to be a \`function\`, got \`${typeof options.transform}\``
      )
    );
  }

  const rawKey = url + JSON.stringify(options);
  const key = rawKey.replace(/\./g, '\\.');
  const cachedResponse = arvis.cache.get(key, { ignoreMaxAge: true });

  if (cachedResponse && !arvis.cache.isExpired(key)) {
    return Promise.resolve(cachedResponse);
  }

  let response;
  try {
    response = await got(url, options);
  } catch (error) {
    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }

  const data = options.transform
    ? options.transform(response.body)
    : response.body;

  if (options.maxAge) {
    arvis.cache.set(key, data, { maxAge: options.maxAge });
  }

  return data;
};

loudRejection(arvis.error);
process.on('uncaughtException', arvis.error);
hookStd.stderr(arvis.error);
