import CacheConf from 'cache-conf';
import cleanStack from 'clean-stack';
import Conf from 'conf';
import dotProp from 'dot-prop';
import got, { GotOptions } from 'got';
import hookStd from 'hook-std';
import loudRejection from 'loud-rejection';
import os from 'os';
import path from 'path';
import ConfMock from './external/confMock';
import CheckUpdate from './lib/updateNotifications';

CheckUpdate();

interface FetchOptions extends GotOptions<string> {
  json?: boolean;
  maxAge?: number;
  transform?: Function;
}

const getIcon = (iconName: string) => {
  if (!iconName) return 'icon name is not valid.';
  return path.resolve(__dirname, 'assets', iconName);
};

const getEnv = (key: string) => process.env[`arvis_${key}`];

const arvish = {
  /**
   * @param  {object} items
   * @param  {{rerunInterval?:number;variables?:object}={}} options
   */
  output: (
    items: object,
    options: { rerunInterval?: number; variables?: object } = {}
  ): object => {
    const output = {
      items,
      rerun: options.rerunInterval,
      variables: options.variables,
    };

    if (getEnv('extension_type') === 'workflow') {
      console.log(JSON.stringify(output, null, '\t'));
    }
    return output;
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
  log: (text: string): void => {
    console.error(text);
  },

  /**
   * @param  {any} error
   */
  error: (error: any): void => {
    const stack = cleanStack(error.stack || error);
    const largeTextKey = process.platform === 'darwin' ? '⌘L' : 'Ctrl + L';
    const copyKey = process.platform === 'darwin' ? '⌘C' : 'Ctrl + C';

    const copy = `
\`\`\`
${stack}
\`\`\`

-
${arvish.meta.name} ${arvish.meta.version}
Arvis ${getEnv('version')}
${process.platform} ${os.release()}
	`.trim();

    if (getEnv('extension_type') === 'workflow') {
      arvish.output([
        {
          title: error.stack ? `${error.name}: ${error.message}` : error,
          subtitle: `Press ${largeTextKey} to see the full error and ${copyKey} to copy it.`,
          valid: false,
          text: {
            copy,
            largetype: stack,
          },
          icon: {
            path: getIcon('error'),
          },
        },
      ]);
    } else {
      console.error(
`In '${getEnv('extension_name')}' plugin, below error occured.
${error.stack ? `${error.name}: ${error.message}` : error}

${stack}`
      );
    }
  },

  /**
   * @param  {string} url
   * @param  {FetchOptions} options?
   */
  fetch: async (url: string, options?: FetchOptions) => {
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
  },

  meta: {
    name: getEnv('extension_name'),
    version: getEnv('extension_version'),
    bundleId: getEnv('extension_bundleid'),
    type: getEnv('extension_type'),
  },

  env: {
    data: getEnv('extension_data'),
    cache: getEnv('extension_cache'),
    history: getEnv('extension_history'),
    home: getEnv('platform_home'),
    desktop: getEnv('platform_desktop'),
    documents: getEnv('platform_documents'),
    downloads: getEnv('platform_downloads'),
    music: getEnv('platform_music'),
    pictures: getEnv('platform_pictures'),
    temp: getEnv('platform_temp'),
    userData: getEnv('platform_userData'),
    appData: getEnv('platform_appData'),
    vidios: getEnv('platform_vidios'),
    crashDumps: getEnv('platform_crashDumps'),
    currentExe: getEnv('platform_currentExe'),
  },

  input: process.argv[2] ? process.argv[2] : '',

  config: getEnv('extension_data')
    ? new Conf({
        cwd: getEnv('extension_data'),
        configName: getEnv('extension_name'),
      })
    : new ConfMock(),

  cache: getEnv('extension_cache')
    ? new CacheConf({
        configName: getEnv('extension_name'),
        cwd: getEnv('extension_cache'),
        version: getEnv('extension_version'),
      })
    : new ConfMock(),

  icon: {
    info: getIcon('info'),
    warning: getIcon('warning'),
    error: getIcon('error'),
    alert: getIcon('alert'),
    like: getIcon('like'),
    delete: getIcon('delete'),
  },
};

loudRejection(arvish.error);
hookStd.stderr(arvish.error);

if (arvish.meta.type === 'workflow') {
  process.on('uncaughtException', arvish.error);
}

export = arvish;
