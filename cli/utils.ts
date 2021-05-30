import chalk from 'chalk';
import fs from 'fs';

/**
 * @param  {string} errMsg
 */
export const error = (errMsg: string) =>
  console.error(chalk.bgRed(chalk.white(errMsg)));

/**
 * @param  {string} file
 */
export async function checkFileExists(file: string) {
  return fs.promises
    .access(file, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}
