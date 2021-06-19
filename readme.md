# Arvish

[![CodeFactor](https://www.codefactor.io/repository/github/jopemachine/arvish/badge)](https://www.codefactor.io/repository/github/jopemachine/arvish)
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

## alfy

This library is forked from [alfy](https://github.com/sindresorhus/alfy).

So, It has almost same programmatic API with `alfy`.

This means you might simply replace alfred-workflows written in `alfy` with `arvish`.

Note that below differences between arvish and alfy.

* `arvish` does not support `top-await` feature.

* Arvis provides `$PATH` to extension's scripts. So, [run-node](https://github.com/sindresorhus/run-node) is removed in `arvish`.

## Icon sources

This lib uses below icon sources

<a target="_blank" href="https://icons8.com">Image</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
