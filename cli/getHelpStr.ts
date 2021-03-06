import chalk from 'chalk';

export default () =>
	chalk.whiteBright(`
Usage
	To add arvis-workflow.json skeleton to current directory,
		$ arvish init workflow

	To add arvis-plugin.json skeleton to current directory,
		$ arvish init plugin

	To convert alfredworkflow's info.plist to arvis-workflow.json,
		$ arvish convert
		$ arvish convert info.plist

	To build arvis-extension's directory to installer file,
		$ arvish build
		$ arvish build workflow /Users/user/Destop/some_extension

	To validate arvis-extension json file,
		$ arvish validate workflow arvis-workflow.json
		$ arvish validate plugin arvis-plugin.json

	To publish arvis-extension to arvis-store,
		$ arvish publish

	To retrieve arvis-extension informations,
		$ arvish view [some_extension_name]

See README.md for more details.
`);
