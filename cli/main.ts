#!/usr/bin/env node
import convert from 'alfred-to-arvis';
import { validate as validateJson } from 'arvis-extension-validator';
import chalk from 'chalk';
import fse from 'fs-extra';
import meow from 'meow';
import path from 'path';
import { error } from '../lib/utils';
import { buildHandler } from './build';
import getHelpStr from './getHelpStr';
import initPlugin from './initPlugin';
import initWorkflow from './initWorkflow';
import { publish, view } from './store';

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
        console.log(chalk.white(`${chalk.green('✔️')} Created arvis-plugin.json.`));
      } else if (input[1] === 'workflow') {
        initWorkflow(input[2]);
        console.log(chalk.white(`${chalk.green('✔️')} Created arvis-workflow.json.`));
      } else error('❌ Error: Specify second argument as \'workflow\' or \'plugin\'');
      break;
    }

    case 'build':
      await buildHandler(input);
      break;

    case 'convert':
      if (input[1]) {
        await convert(input[1]);
      } else {
        await convert(path.resolve(process.cwd(), 'info.plist'));
      }
      break;

    case 'pu':
    case 'pub':
    case 'publish':
      publish();
      break;

    case 'view':
      view(input.slice(1));
      break;

    case 'validate':
      fse.readJSON(cli.input[2]).then(jsonData => {
        const { valid, errorMsg } = validateJson(
          jsonData,
          cli.input[1] as 'workflow' | 'plugin'
        );
        if (valid) console.log(chalk.greenBright(`${cli.input[2]} is valid`));
        else {
          error('❌ Not valid file.\n\nReason:\n');
          error(errorMsg);
        }
      });
      break;

    default:
      console.log(getHelpStr());
  }

  return '';
};

const cli = meow(getHelpStr());

(async () => {
  console.log(await cliFunc(cli.input, cli.flags));
})();
