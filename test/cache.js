import test from 'ava';
import delay from 'delay';
import tempfile from 'tempfile';
import {arvish as createArvish} from './_utils.js';

test('no cache', t => {
	const arvish = createArvish();
	arvish.cache.set('foo', 'bar');

	t.is(arvish.cache.get('foo'), 'bar');
	t.true(arvish.cache.has('foo'));
});

test('maxAge option', t => {
	const arvish = createArvish();
	arvish.cache.set('hello', {hello: 'world'}, {maxAge: 300000});

	const age = arvish.cache.store.hello.timestamp - Date.now();

	t.true(age <= 300000 && age >= 299000);
	t.true(arvish.cache.has('hello'));
	t.deepEqual(arvish.cache.get('hello'), {hello: 'world'});
});

test('expired data', async t => {
	const arvish = createArvish();
	arvish.cache.set('expire', {foo: 'bar'}, {maxAge: 5000});

	t.true(arvish.cache.has('expire'));
	t.deepEqual(arvish.cache.get('expire'), {foo: 'bar'});

	await delay(5000);

	t.false(arvish.cache.has('expire'));
	t.falsy(arvish.cache.get('expire'));
	t.falsy(arvish.cache.store.expire);
});

test('versioned data', t => {
	const cache = tempfile();

	const arvish = createArvish({cache, version: '1.0.0'});
	arvish.cache.set('foo', 'bar');

	const arvish2 = createArvish({cache, version: '1.0.0'});
	t.is(arvish2.cache.get('foo'), 'bar');

	const arvish3 = createArvish({cache, version: '1.0.1'});
	t.falsy(arvish3.cache.get('foo'));
});
