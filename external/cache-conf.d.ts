declare module 'cache-conf' {
	import Conf, {Options} from 'conf';

	export interface CacheConfGetOptions {
		/**
		Get the item for the key provided without taking the `maxAge` of the item into account.
		*/
		readonly ignoreMaxAge?: boolean;
	}

	export interface CacheConfSetOptions {
		/**
		Number of milliseconds the cached value is valid.
		*/
		readonly maxAge?: number;
	}

	export interface CacheConfConstructorOptions<T> extends Options<T> {
		readonly version?: string;
	}

	export class CacheConf<T> extends Conf<T> {
		isExpired: (key: T) => boolean;

		get<Key extends keyof T>(key: Key, options?: CacheConfGetOptions): T[Key];
		get<Key extends keyof T>(key: Key, defaultValue: Required<T>[Key], options?: CacheConfGetOptions): Required<T>[Key];
		get<Key extends string, Value = unknown>(key: Exclude<Key, keyof T>, defaultValue?: Value, options?: CacheConfGetOptions): Value;
		get(key: string, defaultValue?: unknown, options?: CacheConfGetOptions): unknown;

		set<Key extends keyof T>(key: Key, value?: T[Key], options?: CacheConfSetOptions): void;
		set(key: string, value: unknown, options: CacheConfSetOptions): void;
		set(object: Partial<T>, options: CacheConfSetOptions): void;
		set<Key extends keyof T>(key: Partial<T> | Key | string, value?: T[Key] | unknown, options?: CacheConfSetOptions): void;

		constructor(partialOptions: CacheConfConstructorOptions<T>);
	}

	export default CacheConf;
}
