import chalk from 'chalk';
import logSymbols from 'log-symbols';

/**
 * @param errMsg
 */
export const error = (errorMessage: string) => {
	console.error(`${logSymbols.error} ${chalk.bgRed(chalk.white(errorMessage))}`);
};
