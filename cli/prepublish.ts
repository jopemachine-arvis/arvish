#!/usr/bin/env node
import { validate } from 'arvis-extension-validator';
import chalk from 'chalk';
import findUp from 'find-up';
import fse from 'fs-extra';
import logSymbols from 'log-symbols';
import path from 'path';

const extensionJsonPath = findUp.sync(['arvis-workflow.json', 'arvis-plugin.json'], { allowSymlinks: false, type: 'file' });

if (!extensionJsonPath) {
  console.error(chalk.red(`${logSymbols.error} It seems current directory is not arvis extension directory.`));
  process.exit(1);
}

const extensionDir = path.dirname(extensionJsonPath);
const pkgPath = path.resolve(extensionDir, 'package.json');
const pkgExist = fse.pathExistsSync(pkgPath);
const pkg = pkgExist ? fse.readJSONSync(pkgPath) : undefined;
const info = fse.readJSONSync(extensionJsonPath!);
const type = extensionJsonPath.endsWith('arvis-workflow.json') ? 'workflow' : 'plugin';

if (pkg.name !== info.name) {
  console.error(`${logSymbols.error} Make sure the package name is the same as the extension name.`);
  process.exit(1);
}

if (pkg.version !== info.version) {
  console.error(`${logSymbols.error} Make sure the package version is the same as the extension version.`);
  process.exit(1);
}

const { valid, errorMsg } = validate(info, type, { strict: true });

if (!valid) {
  console.error(errorMsg);
  process.exit(1);
}

console.log(chalk.white(`${logSymbols.success} valid extension format`));