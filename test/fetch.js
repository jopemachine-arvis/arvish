import test from 'ava';
import nock from 'nock';
import delay from 'delay';
import tempfile from 'tempfile';
import {arvish as createArvish} from './_utils.js';

const URL = 'https://foo.bar';

test.before(() => {
	nock(URL)
		.get('/no-cache')
		.times(2)
		.reply(200, {foo: 'bar'});
	nock(URL)
		.get('/cache')
		.once()
		.reply(200, {hello: 'world'});
	nock(URL)
		.get('/cache')
		.twice()
		.reply(200, {hello: 'world!'});
	nock(URL)
		.get('/cache-key?unicorn=rainbow')
		.reply(200, {unicorn: 'rainbow'});
	nock(URL)
		.get('/cache-version')
		.once()
		.reply(200, {foo: 'bar'});
	nock(URL)
		.get('/cache-version')
		.twice()
		.reply(200, {unicorn: 'rainbow'});
});

test('no cache', async t => {
	const arvish = createArvish();
	t.deepEqual(await arvish.fetch(`${URL}/no-cache`), {foo: 'bar'});
	t.falsy(arvish.cache.get(`${URL}/no-cache`));
});

test('transform not a function', async t => {
	const arvish = createArvish();
	await t.throwsAsync(
		arvish.fetch(`${URL}/no-cache`, {transform: 'foo'}),
		'Expected `transform` to be a `function`, got `string`'
	);
});

test('transform', async t => {
	const arvish = createArvish();
	const result = await arvish.fetch(`${URL}/no-cache`, {
		transform: response => {
			response.unicorn = 'rainbow';
			return response;
		}
	});

	t.deepEqual(result, {
		foo: 'bar',
		unicorn: 'rainbow'
	});
});

test('cache', async t => {
	const arvish = createArvish();

	t.deepEqual(await arvish.fetch(`${URL}/cache`, {maxAge: 5000}), {
		hello: 'world'
	});
	t.deepEqual(await arvish.fetch(`${URL}/cache`, {maxAge: 5000}), {
		hello: 'world'
	});

	await delay(5000);

	t.deepEqual(await arvish.fetch(`${URL}/cache`, {maxAge: 5000}), {
		hello: 'world!'
	});
});

test('cache key', async t => {
	const arvish = createArvish();

	t.deepEqual(
		await arvish.fetch(`${URL}/cache-key`, {
			query: {unicorn: 'rainbow'},
			maxAge: 5000
		}),
		{unicorn: 'rainbow'}
	);
	t.truthy(
		arvish.cache.store[
			'https://foo.bar/cache-key{"query":{"unicorn":"rainbow"},"maxAge":5000}'
		]
	);
});

test('invalid version', async t => {
	const cache = tempfile();

	const arvish = createArvish({cache, version: '1.0.0'});
	t.deepEqual(await arvish.fetch(`${URL}/cache-version`, {maxAge: 5000}), {
		foo: 'bar'
	});
	t.deepEqual(await arvish.fetch(`${URL}/cache-version`, {maxAge: 5000}), {
		foo: 'bar'
	});
	t.deepEqual(
		arvish.cache.store['https://foo.bar/cache-version{"maxAge":5000}']
			.data,
		{foo: 'bar'}
	);

	const arvish2 = createArvish({cache, version: '1.0.0'});
	t.deepEqual(await arvish2.fetch(`${URL}/cache-version`, {maxAge: 5000}), {
		foo: 'bar'
	});

	const arvish3 = createArvish({cache, version: '1.0.1'});
	t.deepEqual(await arvish3.fetch(`${URL}/cache-version`, {maxAge: 5000}), {
		unicorn: 'rainbow'
	});
	t.deepEqual(
		arvish.cache.store['https://foo.bar/cache-version{"maxAge":5000}']
			.data,
		{unicorn: 'rainbow'}
	);
});
