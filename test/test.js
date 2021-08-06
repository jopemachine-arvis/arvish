import test from 'ava';
import hookStd from 'hook-std';
import {arvish} from './_utils.js';

const arvishInstance = arvish();

arvishInstance.input = 'Unicorn';

test('default', t => {
	t.is(typeof arvishInstance.icon.error, 'string');
});

test.serial('.error()', async t => {
	process.env.arvis_extension_type = 'workflow';

	const promise = hookStd.stdout(output => {
		promise.unhook();
		t.is(JSON.parse(output).items[0].title, 'Error: foo');
	});

	arvishInstance.error(new Error('foo'));

	await promise;
});

test('.matches()', t => {
	t.deepEqual(arvishInstance.matches('Unicorn', ['foo', 'unicorn']), ['unicorn']);
	t.deepEqual(
		arvishInstance.matches(
			'Unicorn',
			[{name: 'foo'}, {name: 'unicorn'}],
			'name'
		),
		[{name: 'unicorn'}]
	);
	t.deepEqual(
		arvishInstance.matches(
			'Foobar',
			[
				{name: 'foo', sub: 'bar'},
				{name: 'unicorn', sub: 'rainbow'}
			],
			(item, input) => item.name + item.sub === input
		),
		[{name: 'foo', sub: 'bar'}]
	);
});

test('.inputMatches()', t => {
	t.deepEqual(arvishInstance.inputMatches(['foo', 'unicorn']), ['unicorn']);
});
