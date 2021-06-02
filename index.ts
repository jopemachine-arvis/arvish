import Conf from 'conf';
import CacheConf from 'cache-conf';
import ConfMock from './external/confMock';
import os from 'os';
import got from 'got';
import hookStd from 'hook-std';
import loudRejection from 'loud-rejection';
import cleanStack from 'clean-stack';
import dotProp from 'dot-prop';
import updateCheck from '@jopemachine/arvis-notifier';

updateCheck();

const getEnv = (key: string) => process.env[`arvis_${key}`];

const arvish = {
  /**
   * @param  {object} items
   * @param  {{rerunInterval?:number;variables?:object}={}} options
   */
  output: (
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
  },

  /**
   * @param  {string} input
   * @param  {any} list
   * @param  {string|Function} item
   */
  matches: (input: string, list: any, item: string | Function) => {
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
  },

  /**
   * @param  {string[]} list
   * @param  {string|Function} item
   */
  inputMatches: (list: string[], item: string | Function) =>
    arvish.matches(arvish.input, list, item),

  /**
   * @param  {string} text
   */
  log: (text: string) => {
    console.error(text);
  },

  /**
   * @param  {any} error
   */
  error: (error: any) => {
    const stack = cleanStack(error.stack || error);
    const largeTextKey = process.platform === 'darwin' ? '⌘L' : 'Ctrl + L';
    const copyKey = process.platform === 'darwin' ? '⌘C' : 'Ctrl + C';

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
  },

  /**
   * @param  {string} url
   * @param  {any} options
   */
  fetch: async (url: string, options: any) => {
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
    const cachedResponse = arvish.getCache().get(key, { ignoreMaxAge: true });

    if (cachedResponse && !arvish.getCache().isExpired(key)) {
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
      arvish.getCache().set(key, data, { maxAge: options.maxAge });
    }

    return data;
  },

  meta: {
    name: getEnv('extension_name'),
    version: getEnv('extension_version'),
    bundleId: getEnv('extension_bundleid')
  },

  env: {
    data: getEnv('extension_data'),
    cache: getEnv('extension_cache'),
    history: getEnv('extension_history')
  },

  input: process.argv[2],

  getConfig: () =>
    getEnv('extension_data')
      ? new Conf({
          cwd: getEnv('extension_data')
        })
      : new ConfMock(),

  getCache: () =>
    getEnv('extension_cache')
      ? new CacheConf({
          configName: 'cache',
          cwd: getEnv('extension_cache'),
          version: getEnv('extension_version')
        })
      : new ConfMock(),

  /**
   * @deprecated Get getConfig instead of config.
   *             arvish object is singleton in pluginWorkspace,
   *             So the config object can refer to another config object.
   *             Left for compatibility with Alfy and could be removed later.
   */
  config: getEnv('extension_data')
    ? new Conf({
        cwd: getEnv('extension_data')
      })
    : new ConfMock(),

  /**
   * @deprecated Get getCache instead of cache.
   *             arvish object is singleton in pluginWorkspace,
   *             So the cache object can refer to another cache object.
   *             Left for compatibility with Alfy and could be removed later.
   */
  cache: getEnv('extension_cache')
    ? new CacheConf({
        configName: 'cache',
        cwd: getEnv('extension_cache'),
        version: getEnv('extension_version')
      })
    : new ConfMock()
};

loudRejection(arvish.error);
process.on('uncaughtException', arvish.error);
hookStd.stderr(arvish.error);

export = arvish;