#!/usr/bin/env node
import os from 'os';
import Conf from 'conf';
import got from 'got';
import hookStd from 'hook-std';
import loudRejection from 'loud-rejection';
import cleanStack from 'clean-stack';
import dotProp from 'dot-prop';
import CacheConf from 'cache-conf';

const arvish = module.exports;

const getEnv = (key: string) => process.env[`arvis_${key}`];

arvish.meta = {
  name: getEnv('extension_name'),
  version: getEnv('extension_version'),
  uid: getEnv('extension_uid'),
  bundleId: getEnv('extension_bundleid')
};

arvish.env = {
  data: getEnv('extension_data'),
  cache: getEnv('extension_cache')
};

arvish.input = process.argv[2];

arvish.output = (
  items: object,
  options: { rerunInterval?: number; variables?: object } = {}
) => {
  console.log(
    JSON.stringify(
      { items, rerun: options.rerunInterval, variables: options.variables },
      null,
      '\t'
    )
  );
};

arvish.matches = (input: string, list: any, item: string | Function) => {
  input = input.toLowerCase().normalize();

  return list.filter((x: any) => {
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

arvish.inputMatches = (list: string[], item: string | Function) =>
  arvish.matches(arvish.input, list, item);

arvish.log = (text: string) => {
  console.error(text);
};

arvish.error = (error: Error) => {
  const stack = cleanStack(error.stack?.toString() || error.message);
  const largeTextKey = process.platform === 'darwin' ? '⌘L' : 'Ctl L';
  const copyKey = process.platform === 'darwin' ? '⌘C' : 'Ctl C';

  const copy = `
\`\`\`
${stack}
\`\`\`

-
${arvish.meta.name} ${arvish.meta.version}
arvish
${process.platform} ${os.release()}
	`.trim();

  arvish.output([
    {
      title: error.stack ? `${error.name}: ${error.message}` : error,
      subtitle: `Press ${largeTextKey} to see the full error and ${copyKey} to copy it.`,
      valid: false,
      text: {
        copy,
        largetype: stack
      }
    }
  ]);
};

if (arvish.env.data) {
  arvish.config = new Conf({
    cwd: arvish.env.data
  });
}

if (arvish.env.cache) {
  arvish.cache = new CacheConf({
    configName: 'cache',
    cwd: arvish.env.cache,
    version: arvish.meta.version
  });
}

arvish.fetch = async (url: string, options: any) => {
  options = {
    json: true,
    ...options
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
  const cachedResponse = arvish.cache.get(key, { ignoreMaxAge: true });

  if (cachedResponse && !arvish.cache.isExpired(key)) {
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
    arvish.cache.set(key, data, { maxAge: options.maxAge });
  }

  return data;
};

loudRejection(arvish.error);
process.on('uncaughtException', arvish.error);
hookStd.stderr(arvish.error);
