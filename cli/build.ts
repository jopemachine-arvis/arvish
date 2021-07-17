import { validate } from 'arvis-extension-validator';
import chalk from 'chalk';
import fse from 'fs-extra';
import path from 'path';
import pathExists from 'path-exists';
import { zipExtensionFolder } from '../lib/build';

export const buildHandler = async (input: string[]): Promise<void> => {
  if (input[1] && input[2]) {

    if (input[2] !== 'workflow' && input[2] !== 'plugin') {
      throw new Error('❌ Error: Specify second argument as \'workflow\' or \'plugin\'');
    }

    const { valid, errorMsg } = validate(await fse.readJSON(input[2]), input[1] as 'workflow' | 'plugin');

    if (valid) {
      await zipExtensionFolder(process.cwd(), input[1] as 'workflow' | 'plugin');
    } else {
      throw new Error(errorMsg);
    }

    await zipExtensionFolder(input[2], input[1] as 'workflow' | 'plugin');
  } else {

    const workflowPath = path.resolve(process.cwd(), 'arvis-workflow.json');
    const pluginPath = path.resolve(process.cwd(), 'arvis-plugin.json');

    if (
      await pathExists(workflowPath)
    ) {
      const { valid, errorMsg } = validate(await fse.readJSON(workflowPath), 'workflow');
      if (valid) {
        await zipExtensionFolder(process.cwd(), 'workflow');
      } else {
        throw new Error(errorMsg);
      }
    }

    else if (
      await pathExists(pluginPath)
    ) {
      const { valid, errorMsg } = validate(await fse.readJSON(pluginPath), 'plugin');
      if (valid) {
        await zipExtensionFolder(process.cwd(), 'plugin');
      } else {
        throw new Error(errorMsg);
      }
    }

    else {
      throw new Error(
        '❌ Error: It seems that current directoy is not arvis extension\'s directory'
      );
    }
  }

  console.log(chalk.white(`${chalk.green('✔️')} Jobs done`));
};