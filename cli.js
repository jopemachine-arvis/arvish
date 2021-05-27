#!/usr/bin/env node
const getHelpStr = require('./getHelpStr');
const meow = require('meow');
const initPlugin = require('./cli/initPlugin');
const initWorkflow = require('./cli/initWorkflow');

/**
 * @param  {string[]} input
 * @param  {any} flags
 * @summary cli main function
 */
const cliFunc = async (input, flags) => {
	switch (input[0]) {
		case 'init': {
			if (input[1] === 'plugin') initPlugin();
			else if (input[1] === 'workflow') initWorkflow();
			else console.error("Specify second argument as 'workflow' or 'plugin'");
			break;
		}
		case 'zip':
			break;
	}

	return '';
};

const cli = meow(getHelpStr(), {});

console.log(cli.input);

(async () => {
	console.log(await cliFunc(cli.input, cli.flags));
})();
