# Arvish

[![CodeFactor](https://www.codefactor.io/repository/github/jopemachine/arvish/badge)](https://www.codefactor.io/repository/github/jopemachine/arvish)
[![Known Vulnerabilities](https://snyk.io/test/github/jopemachine/arvish/badge.svg)]()
[![BuildStatus](https://api.travis-ci.com/jopemachine/arvish.svg)](https://www.npmjs.com/package/arvish)
[![NPM download total](https://img.shields.io/npm/dt/arvish)](http://badge.fury.io/js/arvish)
[![NPM version](https://badge.fury.io/js/arvish.svg)](http://badge.fury.io/js/arvish)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![PR's Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](http://makeapullrequest.com)
[![GitHub issues](https://img.shields.io/github/issues/jopemachine/arvish.svg)](https://GitHub.com/jopemachine/arvish/issues/)

Lib that helps you create [Arvis](https://github.com/jopemachine/arvis) `workflow`, `plugin` more easily.

(Not necessary for extension creation).

Arvish has both the Cli tools and libraries needed to create `extension`

Check the below documents.

* [Cli](./documents/cli.md)

* [Library for workflow](./documents/lib-workflow.md)

* [Library for plugin](./documents/lib-plugin.md)

## Update notifications

Arvish uses [arvis-notifier](https://github.com/jopemachine/arvis-notifier) in the background to show a notification when an update for extensions is available.

## Caching

Arvish offers the possibility of caching data, either with the [fetch](#fetchurl-options) or directly through the [cache](#cache) object.

An important thing to note is that the cached data gets invalidated automatically when you update your extension. This offers the flexibility for developers to change the structure of the cached data between extensions without having to worry about invalid older data.

## Publish extension to npm

By adding `arvish-init` as `postinstall` and `arvish-cleanup` as `preuninstall` script, you can publish your package to [npm](https://npmjs.org). This way, your packages are only one simple `npm install` command away.

```json
{
	"name": "arvis-unicorn",
	"scripts": {
		"postinstall": "arvish-init",
		"preuninstall": "arvish-cleanup"
	},
	"dependencies": {
		"arvish": "*"
	}
}
```

After publishing your extension to npm, your users can easily install or update the extension.

```
$ npm install --global arvis-unicorn
```

## Environment variables

Arvis lets users set environment variables for a extension which can then be used by that extension. This can be useful if you, for example, need the user to specify an API token for a service. You can access the extension environment variables from [`process.env`](https://nodejs.org/api/process.html#process_process_env). For example `process.env.apiToken`.


## alfy

This library is forked from [alfy](https://github.com/sindresorhus/alfy).

So, It has almost same programmatic API with `alfy`.

This means you might simply replace alfred-workflows written in `alfy` with `arvish`.

Note that below differences between arvish and alfy.

* `arvish` does not support `top-await` feature.

* Arvis provides `$PATH` to extension's scripts. So, [run-node](https://github.com/sindresorhus/run-node) is removed in `arvish`.

## Related

- [arvis-linker](https://github.com/jopemachine/arvis-linker) - Make Arvis extensions installable from npm

- [arvis-notifier](https://github.com/jopemachine/arvis-notifier) - Update notifications for Arvis extension

- [alfred-to-arvis](https://github.com/jopemachine/alfred-to-arvis) - Help to convert alfred 4 workflow's info.plist to arvis-workflow.json

- [arvis-extension-validator](https://github.com/jopemachine/arvis-extension-validator) - Arvis extension's JSON schema, cli and library to validate these.

- [arvish-test](https://github.com/jopemachine/arvish-test) - Test your Arvish extensions

## Icon sources

This lib uses below icon sources

<a target="_blank" href="https://icons8.com">Image</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
