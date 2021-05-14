# Arvis-workflow-tools

Some tools that helps you create arvis-workflow more easily.

Forked from [alfy](https://github.com/sindresorhus/alfy).

## Example

Here we fetch some JSON from a placeholder API and present matching items to the user:

```js
const alfy = require('arvis-workflow-tools');

const data = await alfy.fetch('https://jsonplaceholder.typicode.com/posts');

const items = alfy
	.inputMatches(data, 'title')
	.map(element => ({
		title: element.title,
		subtitle: element.body,
		arg: element.id
	}));

alfy.output(items);
```

## API

#### input

Type: `string`

Input from Arvis. What the user wrote in the input box.

#### output(list, options?)

Return output to Alfred.

##### list

Type: `object[]`

List of `object` with any of the [supported properties](https://www.alfredapp.com/help/workflows/inputs/script-filter/json/).

Example:

```js
alfy.output([
	{
		title: 'Unicorn'
	},
	{
		title: 'Rainbow'
	}
]);
```

##### options

Type: `object`

###### rerunInterval

Type: `number` *(seconds)*\
Values: `0.1...5.0`

A script can be set to re-run automatically after some interval. The script will only be re-run if the script filter is still active and the user hasn't changed the state of the filter by typing and triggering a re-run. [More info.](https://www.alfredapp.com/help/workflows/inputs/script-filter/json/)

For example, it could be used to update the progress of a particular task:

```js
alfy.output(
	[
		{
			title: 'Downloading Unicorns…',
			subtitle: `${progress}%`,
		}
	],
	{
		// Re-run and update progress every 3 seconds.
		rerunInterval: 3
	}
);
```



#### log(value)

Log `value` to the [Alfred workflow debugger](https://www.alfredapp.com/help/workflows/advanced/debugger/).

#### matches(input, list, item?)

Returns an `string[]` of items in `list` that case-insensitively contains `input`.

```js
alfy.matches('Corn', ['foo', 'unicorn']);
//=> ['unicorn']
```

##### input

Type: `string`

Text to match against the `list` items.

##### list

Type: `string[]`

List to be matched against.

##### item

Type: `string | Function`

By default, it will match against the `list` items.

Specify a string to match against an object property:

```js
const list = [
	{
		title: 'foo'
	},
	{
		title: 'unicorn'
	}
];

alfy.matches('Unicorn', list, 'title');
//=> [{title: 'unicorn'}]
```

Or [nested property](https://github.com/sindresorhus/dot-prop):

```js
const list = [
	{
		name: {
			first: 'John',
			last: 'Doe'
		}
	},
	{
		name: {
			first: 'Sindre',
			last: 'Sorhus'
		}
	}
];

alfy.matches('sindre', list, 'name.first');
//=> [{name: {first: 'Sindre', last: 'Sorhus'}}]
```

Specify a function to handle the matching yourself. The function receives the list item and input, both lowercased, as arguments, and is expected to return a boolean of whether it matches:

```js
const list = ['foo', 'unicorn'];

// Here we do an exact match.
// `Foo` matches the item since it's lowercased for you.
alfy.matches('Foo', list, (item, input) => item === input);
//=> ['foo']
```

#### inputMatches(list, item?)

Same as `matches()`, but with `alfy.input` as `input`.

#### error(error)

Display an error or error message in Alfred.

**Note:** You don't need to `.catch()` top-level promises. Alfy handles that for you.

##### error

Type: `Error | string`

Error or error message to be displayed.

#### fetch(url, options?)

Returns a `Promise` that returns the body of the response.

##### url

Type: `string`

URL to fetch.

##### options

Type: `object`

Any of the [`got` options](https://github.com/sindresorhus/got#options).

###### json

Type: `boolean`\
Default: `true`

Parse response body with `JSON.parse` and set `accept` header to `application/json`.

###### maxAge

Type: `number`

Number of milliseconds this request should be cached.

###### transform

Type: `Function`

Transform the response before it gets cached.

```js
await alfy.fetch('https://api.foo.com', {
	transform: body => {
		body.foo = 'bar';
		return body;
	}
})
```

You can also return a Promise.

```js
const xml2js = require('xml2js');
const pify = require('pify');

const parseString = pify(xml2js.parseString);

await alfy.fetch('https://api.foo.com', {
	transform: body => parseString(body)
})
```

#### config

Type: `object`

Persist config data.

Exports a [`conf` instance](https://github.com/sindresorhus/conf#instance) with the correct config path set.

Example:

```js
alfy.config.set('unicorn', '🦄');

alfy.config.get('unicorn');
//=> '🦄'
```

#### cache

Type: `object`

Persist cache data.

Exports a modified [`conf` instance](https://github.com/sindresorhus/conf#instance) with the correct cache path set.

Example:

```js
alfy.cache.set('unicorn', '🦄');

alfy.cache.get('unicorn');
//=> '🦄'
```

##### maxAge

The `set` method of this instance accepts an optional third argument where you can provide a `maxAge` option. `maxAge` is
the number of milliseconds the value is valid in the cache.

Example:

```js
const delay = require('delay');

alfy.cache.set('foo', 'bar', {maxAge: 5000});

alfy.cache.get('foo');
//=> 'bar'

// Wait 5 seconds
await delay(5000);

alfy.cache.get('foo');
//=> undefined
```


#### meta

Type: `object`

Example:

```js
{
	name: 'Emoj',
	version: '0.2.5',
	uid: 'user.workflow.B0AC54EC-601C-479A-9428-01F9FD732959',
	bundleId: 'com.sindresorhus.emoj'
}
```

##### data

Recommended location for non-volatile data. Just use `alfy.data` which uses this path.

##### cache

Recommended location for volatile data. Just use `alfy.cache` which uses this path.