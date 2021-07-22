import chalk from 'chalk';
import logSymbols from 'log-symbols';

/**
 * @param  {string} errMsg
 */
export const error = (errMsg: string) =>
  console.error(`${logSymbols.error} ${chalk.bgRed(chalk.white(errMsg))}`);
