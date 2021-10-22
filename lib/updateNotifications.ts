import {checkUpdate} from 'arvis-notifier';
import findUp from 'find-up';
import fse from 'fs-extra';
import logSymbols from 'log-symbols';
import path from 'path';
import { readJson5 } from './readJson5';

export default async () => {
	const currentDir = __dirname.split(path.sep).slice(0, -2).join(path.sep);
	const pkgPath = await findUp('package.json', {cwd: currentDir});

	if (!pkgPath) {
		throw new Error(`${logSymbols.error} Extension\'s package.json not found!`);
	}

	const pkg = await readJson5(pkgPath) as any;
	const arvish = pkg.arvish || {};

	if (arvish.updateNotification !== false) {
		checkUpdate();
	}
};
