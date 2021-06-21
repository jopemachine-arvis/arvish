## Plugin Example

Here we fetch some JSON from a placeholder API and present matching items to the user:

```js
const arvish = require('arvish');

const getPluginItems = async ({ inputStr }) => {
	const data = await arvish.fetch('https://jsonplaceholder.typicode.com/posts');

	const items = arvish
		.inputMatches(data, 'title')
		.map(element => ({
			title: element.title,
			subtitle: element.body,
			arg: element.id
		}));

	return {
		items
	};
};
```

## API

#### input

Type: `string`

Input from Arvis. What the user wrote in the input box.

#### log(value)

Log `value` to the debugger

#### matches(input, list, item?)

Returns an `string[]` of items in `list` that case-insensitively contains `input`.

```js
arvish.matches('Corn', ['foo', 'unicorn']);
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
		title: 'bar'
	}
];

arvish.matches('foo', list, 'title');
//=> [{title: 'foo'}]
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
			first: 'Gil-dong',
			last: 'Hong'
		}
	}
];

arvish.matches('gil-dong', list, 'name.first');
//=> [{name: {first: 'Gil-dong', last: 'Hong'}}]
```

Specify a function to handle the matching yourself. The function receives the list item and input, both lowercased, as arguments, and is expected to return a boolean of whether it matches:

```js
const list = ['foo', 'bar'];

// Here we do an exact match.
// `Foo` matches the item since it's lowercased for you.
arvish.matches('Foo', list, (item, input) => item === input);
//=> ['foo']
```

#### inputMatches(list, item?)

Same as `matches()`, but with `arvish.input` as `input`.

#### error(error)

Display an error or error message in debugger.

**Note:** You don't need to `.catch()` top-level promises. Arvish handles that for you.

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
await arvish.fetch('https://api.foo.com', {
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

await arvish.fetch('https://api.foo.com', {
	transform: body => parseString(body)
})
```

#### config

Type: `object`

Persist config data.

Exports a [`conf` instance](https://github.com/sindresorhus/conf#instance) with the correct config path set.

Example:

```js
arvish.conf.set('unicorn', '🦄');

arvish.conf.get('unicorn');
//=> '🦄'
```

#### cache

Type: `() => object`

Persist cache data.

Exports a modified [`conf` instance](https://github.com/sindresorhus/conf#instance) with the correct cache path set.

Example:

```js
arvish.cache.set('unicorn', '🦄');

arvish.cache.get('unicorn');
//=> '🦄'
```

##### maxAge

The `set` method of this instance accepts an optional third argument where you can provide a `maxAge` option. `maxAge` is
the number of milliseconds the value is valid in the cache.

Example:

```js
const delay = require('delay');

arvish.cache.set('foo', 'bar', {maxAge: 5000});

arvish.cache.get('foo');
//=> 'bar'

// Wait 5 seconds
await delay(5000);

arvish.cache.get('foo');
//=> undefined
```

#### meta

Type: `object`

Example:

```js
{
	name: 'some_extension_name',
	version: '0.0.1',
	bundleId: 'some_extension_bundleId'
}
```

#### env

##### data

Recommended location for non-volatile data. Just use `arvish.config` which uses this path.

##### cache

Recommended location for volatile data. Just use `arvish.cache` which uses this path.

##### history 

Path for saving the action logs and query logs.

##### home

User's home directory.

##### crashDumps

Directory where crash dumps are stored.

##### desktop

The current user's Desktop directory.

##### documents

Directory for a user's "My Documents".

##### downloads

Directory for a user's "Downloads".

##### currentExe

The current executable file.

##### music

Directory for a user's music.

##### pictures

Directory for a user's pictures.

##### temp

Temporary directory

##### userData

The directory for storing your app's configuration files, which by default it is the appData directory appended with your app's name.

##### appData

Per-user application data directory, which by default points to



