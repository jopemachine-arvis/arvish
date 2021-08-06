import {checkUpdate} from 'arvis-notifier';
import findUp from 'find-up';
import fse from 'fs-extra';
import logSymbols from 'log-symbols';
import path from 'path';

export default async () => {
	const currentDir = __dirname.split(path.sep).slice(0, -2).join(path.sep);
	const pkgPath = await findUp('package.json', {cwd: currentDir});

	if (!pkgPath) {
		throw new Error(`${logSymbols.error} Extension\'s package.json not found!`);
	}

	const pkg = await fse.readJSON(pkgPath);
	const arvish = pkg.arvish || {};

	if (arvish.updateNotification !== false) {
		checkUpdate();
	}
};
