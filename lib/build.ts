import archiver from 'archiver';
import {validate as validateJson} from 'arvis-extension-validator';
import chalk from 'chalk';
import fg from 'fast-glob';
import fs from 'fs';
import fse from 'fs-extra';
import logSymbols from 'log-symbols';
import ora, {Ora} from 'ora';
import path from 'path';
import {regex as junkRegex} from 'junk';
import {error} from './utils';

/**
 * @param source
 * @param type
 */
export const zipExtensionFolder = async (
	source: string,
	type: 'workflow' | 'plugin'
): Promise<void> => {
	try {
		const json = await fse.readJSON(
			`${process.cwd()}${path.sep}arvis-${type}.json`
		);

		const {errorMsg, valid} = validateJson(json, type);

		if (!valid) {
			error(`Error: It seems that arvis-${type}.json file is not valid\n`);
			error(errorMsg);
			return;
		}

		const bundleId = `${json.creator}.${json.name}`;
		const target = path.resolve(source, `${bundleId}.arvis${type}`);

		const spinner = ora({
			color: 'cyan',
			discardStdin: true
		}).start(chalk.whiteBright(`Creating '${bundleId}.arvis${type}'..`));

		await zipCurrentDir(source, target, spinner);
		spinner.succeed();
	} catch (error_) {
		console.error(error_);
	}
};

/**
 * @param source
 * @param out
 * @param spinner
 */
const zipCurrentDir = async (
	source: string,
	out: string,
	spinner: Ora
): Promise<void> => {
	const archive = archiver('zip', {zlib: {level: 9}});
	const stream = fs.createWriteStream(out);
	const targetFileName = out.split(path.sep).pop();
	if (!targetFileName) {
		throw new Error(`${logSymbols.error} Target file name not exist`);
	}

	return new Promise((resolve, reject) => {
		fg(['.**', 'package-lock.json', 'yarn.lock', junkRegex.toString()], {
			cwd: process.cwd(),
			dot: true,
			deep: 1,
			onlyFiles: true,
			globstar: false,
			followSymbolicLinks: false
		}).then(ignoredFiles => {
			for (const ignoreFile of ignoredFiles) {
				spinner.warn(chalk.dim(`'${ignoreFile}' is ignored..`)).start();
			}

			archive
				.glob('**', {
					cwd: source,
					ignore: ['^[.].*', 'package-lock.json', 'yarn.lock', targetFileName, junkRegex.toString()]
				})
				.on('error', reject)
				.pipe(stream);

			stream.on('close', resolve);
			archive.finalize();
		});
	});
};

export {zipCurrentDir};
