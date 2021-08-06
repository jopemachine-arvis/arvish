/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import {expectType} from 'tsd';
import arvish from './index.js';
import {ScriptFilterItem} from './types.js';
import './external/cache-conf';

const mockItems: ScriptFilterItem[] = [
	{
		title: 'Unicorn'
	},
	{
		title: 'Rainbow'
	}
];

expectType<string[]>(arvish.matches('Corn', ['foo', 'unicorn']));

expectType<ScriptFilterItem[]>(arvish.matches('Unicorn', mockItems, 'title'));

expectType<string[]>(arvish.inputMatches(['foo', 'unicorn']));

expectType<ScriptFilterItem[]>(arvish.inputMatches(mockItems, 'title'));

expectType<void>(arvish.error(new Error('some error')));

expectType<void>(arvish.log('some message'));

expectType<Promise<unknown>>(arvish.fetch('https://foo.bar', {
	transform: body => body
}));
