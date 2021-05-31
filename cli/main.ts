#!/usr/bin/env node
import getHelpStr from './getHelpStr';
import meow from 'meow';
import initPlugin from './initPlugin';
import initWorkflow from './initWorkflow';
import { zipExtensionFolder } from './zip';
import path from 'path';
import chalk from 'chalk';
import { checkFileExists, error } from './utils';
import convert from 'arvis-plist-converter';

/**
 * @param  {string[]} input
 * @param  {any} flags?
 * @summary cli main function
 */
const cliFunc = async (input: string[], flags?: any) => {
  switch (input[0]) {
    case 'init': {
      if (input[1] === 'plugin') {
        initPlugin(input[2]);
        console.log(chalk.cyan(`Created arvis-plugin.json..`));
      } else if (input[1] === 'workflow') {
        initWorkflow(input[2]);
        console.log(chalk.cyan(`Created arvis-workflow.json..`));
      } else error("Error: Specify second argument as 'workflow' or 'plugin'");
      break;
    }

    case 'zip':
      if (input[1] && input[2]) {
        if (input[2] !== 'workflow' && input[2] !== 'plugin') {
          error("Error: Specify second argument as 'workflow' or 'plugin'");
          return;
        }

        await zipExtensionFolder(input[2], input[1]);
      } else {
        if (
          await checkFileExists(
            `${process.cwd()}${path.sep}arvis-workflow.json`
          )
        ) {
          await zipExtensionFolder(process.cwd(), 'workflow');
        } else if (
          await checkFileExists(`${process.cwd()}${path.sep}arvis-plugin.json`)
        ) {
          await zipExtensionFolder(process.cwd(), 'plugin');
        } else {
          error(
            "Error: It seems that current directoy is not arvis extension's directory"
          );
          return;
        }
      }
      console.log(chalk.green('Jobs done!'));
      break;

    case 'convert':
      if (input[1]) {
        await convert(input[1]);
      } else {
        await convert(`${process.cwd()}${path.sep}info.plist`);
      }
      break;
  }

  return '';
};

const cli = meow(getHelpStr());

(async () => {
  console.log(await cliFunc(cli.input, cli.flags));
})();
