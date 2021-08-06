import CacheConf from 'cache-conf';
import cleanStack from 'clean-stack';
import Conf from 'conf';
import dotProp from 'dot-prop';
import got from 'got';
import hookStd from 'hook-std';
import loudRejection from 'loud-rejection';
import os from 'os';
import parseJson from 'parse-json';
import path from 'path';
import ConfMock from './external/confMock';
import CheckUpdate from './lib/updateNotifications';
import {FetchOptions, OutputOptions, ScriptFilterItem} from './types';

CheckUpdate();

const getIcon = (iconName: string) => {
	if (!iconName) {
		return 'Icon name is not valid.';
	}

	return path.resolve(__dirname, 'assets', iconName);
};

const getEnv = (key: string) => process.env[`arvis_${key}`];

/**
Obtain environment variable value with proper type.

@param type
@param key
*/
const getEnvWithType = (type: 'number' | 'json' | 'string', key: string) => {
	const target = process.env[key];

	if (type === 'json') {
		return parseJson(target!);
	}

	if (type === 'number') {
		return Number(target);
	}

	return target;
};

/**
Create Arvis extensions with ease

@example
```
const arvish = require('arvish');

(async () => {
	const data = await arvish.fetch('https://jsonplaceholder.typicode.com/posts');

	const items = arvish
		.inputMatches(data, 'title')
		.map(element => ({
			title: element.title,
			subtitle: element.body,
			arg: element.id
		}));

	arvish.output(items);
}) ();
```
*/
const arvish = {
	/**
	Return output to arvis.

	@param items
	@param options
	@param variables

	@example
	```
	arvish.output([
		{
			title: 'Unicorn'
		},
		{
			title: 'Rainbow'
		}
	]);
	```
	*/
	output: (
		items: ScriptFilterItem[],
		options?: OutputOptions
	): Record<string, unknown> => {
		options = options || {};

		const output = {
			items,
			rerun: options.rerunInterval,
			variables: options.variables
		};

		if (getEnv('extension_type') === 'workflow') {
			console.log(JSON.stringify(output, null, '\t'));
		}

		return output;
	},

	/**
	Returns an string[] of items in list that case-insensitively contains input.

	@param input
	@param list
	@param target
	@returns Items in list that case-insensitively contains input.

	@example
	```
	arvish.matches('Corn', ['foo', 'unicorn']);
	//=> ['unicorn']
	```
	*/
	matches: <T extends string[] | ScriptFilterItem[]> (input: string, list: T, target?: string | ((item: string | ScriptFilterItem, input: string) => boolean)): T => {
		input = input.toLowerCase().normalize();

		return (list as any).filter((x: string | ScriptFilterItem) => {
			if (typeof target === 'string') {
				x = dotProp.get((x as ScriptFilterItem), target)!;
			}

			if (typeof x === 'string') {
				x = x.toLowerCase();
			}

			if (typeof target === 'function') {
				return target(x, input);
			}

			return (x as string).includes(input);
		});
	},

	/**
	Same as matches(), but with `arvish.input` as input.

	@param list
	@param target
	@returns Items in list that case-insensitively contains `arvish.input`.
	*/
	inputMatches: <T extends string[] | ScriptFilterItem[]> (list: T, target?: string | ((item: string | ScriptFilterItem, input: string) => boolean)): T =>
		arvish.matches(arvish.input, list, target),

	/**
	Log value to the arvis workflow debugger.

	@param text
	*/
	log: (text: string): void => {
		console.error(text);
	},

	/**
	Display an error or error message in arvis.

	**Note:** You don't need to `.catch()` top-level promises. Arvish handles that for you.

	@param error
	*/
	error: (error: Error | string): void => {
		const stack = cleanStack((error as Error).stack || (error as string));
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
					title: (error as Error).stack ? `${(error as Error).name}: ${(error as Error).message}` : (error as string),
					subtitle: `Press ${largeTextKey} to see the full error and ${copyKey} to copy it.`,
					valid: false,
					text: {
						copy,
						largetype: stack
					},
					icon: {
						path: getIcon('error')
					}
				}
			]);
		} else {
			console.error(
				`In '${getEnv('extension_name')}' plugin, below error occured.
${(error as Error).stack ? `${(error as Error).name}: ${(error as Error).message}` : error}

${stack}`
			);
		}
	},

	/**
	Returns a Promise that returns the body of the response.

	@param url
	@param options
	@returns Body of the response.

	@example
	```
	await arvish.fetch('https://api.foo.com', {
		transform: body => {
			body.foo = 'bar';
			return body;
		}
	})
	```
	*/
	fetch: async (url: string, options?: FetchOptions) => {
		options = {
			...options
		};

		if (typeof url !== 'string') {
			return Promise.reject(new TypeError(`Expected \`url\` to be a \`string\`, got \`${typeof url}\``));
		}

		if (options.transform && typeof options.transform !== 'function') {
			return Promise.reject(new TypeError(`Expected \`transform\` to be a \`function\`, got \`${typeof options.transform}\``));
		}

		const rawKey = url + JSON.stringify(options);
		const key = rawKey.replace(/\./g, '\\.');
		const cachedResponse = arvish.cache.get(key, {ignoreMaxAge: true});

		if (cachedResponse && !arvish.cache.isExpired(key)) {
			return Promise.resolve(cachedResponse);
		}

		let response;
		try {
			response = await got(url, {searchParams: options.query}).json();
		} catch (error) {
			if (cachedResponse) {
				return cachedResponse;
			}

			throw error;
		}

		const data = options.transform ? options.transform(response) : response;

		if (options.maxAge) {
			arvish.cache.set(key, data, {maxAge: options.maxAge});
		}

		return data;
	},

	/**
	@example
	```
	{
		name: 'Emoj',
		version: '0.2.5',
		uid: 'user.workflow.B0AC54EC-601C-479A-9428-01F9FD732959',
		bundleId: 'com.sindresorhus.emoj'
	}
	```
	*/
	meta: {
		name: getEnv('extension_name'),
		version: getEnv('extension_version'),
		bundleId: getEnv('extension_bundleid'),
		type: getEnv('extension_type')
	},

	env: {
		get: getEnvWithType,
		data: getEnv('extension_data'),
		cache: getEnv('extension_cache'),
		history: getEnv('extension_history'),
		platform: {
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
			currentExe: getEnv('platform_currentExe')
		}
	},

	/**
	Input from Arvis. What the user wrote in the input box.
	*/
	input: process.argv[2] ? process.argv[2] : '',

	/**
	Persist config data.

	Exports a [`conf` instance](https://github.com/sindresorhus/conf#instance) with the correct config path set.

	@example
	```
	arvish.config.set('unicorn', '🦄');

	arvish.config.get('unicorn');
	//=> '🦄'
	```
	*/
	config: getEnv('extension_data') ?
		new Conf({
			cwd: getEnv('extension_data'),
			configName: getEnv('extension_name')
		}) :
		new ConfMock(),

	/**
	Persist cache data.

	Exports a modified [`conf` instance](https://github.com/sindresorhus/conf#instance) with the correct cache path set.

	@example
	```
	arvish.cache.set('unicorn', '🦄');

	arvish.cache.get('unicorn');
	//=> '🦄'
	```
	*/
	cache: getEnv('extension_cache') ?
		new CacheConf({
			configName: getEnv('extension_name'),
			cwd: getEnv('extension_cache'),
			version: getEnv('extension_version')
		}) :
		new ConfMock(),

	/**
	Get various useful icons.
	*/
	icon: {
		info: getIcon('info'),
		warning: getIcon('warning'),
		error: getIcon('error'),
		alert: getIcon('alert'),
		like: getIcon('like'),
		delete: getIcon('delete')
	}
};

loudRejection(arvish.error);
hookStd.stderr(arvish.error);

if (arvish.meta.type === 'workflow') {
	process.on('uncaughtException', arvish.error);
}

export = arvish;
