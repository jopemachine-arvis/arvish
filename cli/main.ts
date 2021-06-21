#!/usr/bin/env node
import convert from 'alfred-to-arvis';
import { validate as validateJson } from 'arvis-extension-validator';
import chalk from 'chalk';
import fse from 'fs-extra';
import meow from 'meow';
import path from 'path';
import pathExists from 'path-exists';
import getHelpStr from './getHelpStr';
import initPlugin from './initPlugin';
import initWorkflow from './initWorkflow';
import { error } from './utils';
import { zipExtensionFolder } from './zip';

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
      } else error('Error: Specify second argument as \'workflow\' or \'plugin\'');
      break;
    }

    case 'build':
      if (input[1] && input[2]) {
        if (input[2] !== 'workflow' && input[2] !== 'plugin') {
          error('Error: Specify second argument as \'workflow\' or \'plugin\'');
          return '';
        }

        await zipExtensionFolder(input[2], input[1] as 'workflow' | 'plugin');
      } else {
        if (
          await pathExists(path.resolve(process.cwd(), 'arvis-workflow.json'))
        ) {
          await zipExtensionFolder(process.cwd(), 'workflow');
        } else if (
          await pathExists(path.resolve(process.cwd(), 'arvis-plugin.json'))
        ) {
          await zipExtensionFolder(process.cwd(), 'plugin');
        } else {
          error(
            'Error: It seems that current directoy is not arvis extension\'s directory'
          );
          return '';
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

    case 'validate':
      fse.readJSON(cli.input[2]).then(jsonData => {
        const { valid, errorMsg } = validateJson(
          jsonData,
          cli.input[1] as 'workflow' | 'plugin'
        );
        if (valid) console.log(chalk.greenBright(`${cli.input[2]} is valid`));
        else {
          error('Not valid file. \nReason:\n');
          error(errorMsg);
        }
      });
      break;
  }

  return '';
};

const cli = meow(getHelpStr());

(async () => {
  console.log(await cliFunc(cli.input, cli.flags));
})();
