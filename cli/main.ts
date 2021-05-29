#!/usr/bin/env node
import getHelpStr from './getHelpStr';
import meow from 'meow';
import initPlugin from './initPlugin';
import initWorkflow from './initWorkflow';
import { zipCurrentDir } from './zip';
import path from 'path';
import chalk from 'chalk';
import { checkFileExists } from './utils';
import fse from 'fs-extra';

const error = (errMsg: string) =>
  console.error(chalk.bgRed(chalk.white(errMsg)));

const zipProperJson = async (type: string) => {
  try {
    const json = await fse.readJSON(
      `${process.cwd()}${path.sep}arvis-${type}.json`
    );
    if (!json.bundleId) {
      error(`Error: It seems that arvis-${type}.json file is not valid`);
    }

    const target = `${process.cwd()}${path.sep}${json.bundleId}.arvis${type}`;
    console.log(chalk.cyan(`Creating '${target}'.. please wait..`));

    await zipCurrentDir(target);
  } catch (err) {
    console.error(err);
  }
};

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
      if (
        await checkFileExists(`${process.cwd()}${path.sep}arvis-workflow.json`)
      ) {
        await zipProperJson('workflow');
      } else if (
        await checkFileExists(`${process.cwd()}${path.sep}arvis-plugin.json`)
      ) {
        await zipProperJson('plugin');
      } else {
        error(
          "Error: It seems that current directoy is not arvis extension's directory"
        );
      }
      break;
  }

  return '';
};

const cli = meow(getHelpStr());

(async () => {
  console.log(await cliFunc(cli.input, cli.flags));
})();
