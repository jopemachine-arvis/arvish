/* eslint-disable camelcase */
'use strict';
const path = require('path');
const tempfile = require('tempfile');

exports.arvish = (options = {}) => {
	delete require.cache[path.resolve(__dirname, '../dist/index.js')];

	process.env.arvis_extension_data = options.data || tempfile();
	process.env.arvis_extension_cache = options.cache || tempfile();
	process.env.arvis_extension_version = options.version || '1.0.0';
	return require('..');
};
