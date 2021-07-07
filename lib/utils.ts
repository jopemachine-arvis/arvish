import chalk from 'chalk';

/**
 * @param  {string} errMsg
 */
export const error = (errMsg: string) =>
  console.error(chalk.bgRed(chalk.white(errMsg)));
