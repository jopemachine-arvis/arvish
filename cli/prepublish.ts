import { validate } from 'arvis-extension-validator';
import chalk from 'chalk';
import findUp from 'find-up';
import fse from 'fs-extra';

const extensionJsonPath = findUp.sync(['arvis-workflow.json', 'arvis-plugin.json'], { allowSymlinks: false, type: 'file'});

if (!extensionJsonPath) {
  console.error(chalk.red('Extension file not found!'));
  process.exit(1);
}

const info = fse.readJSONSync(extensionJsonPath!);
const type = extensionJsonPath.endsWith('arvis-workflow.json') ? 'workflow' : 'plugin';

const { valid, errorMsg } = validate(info, type, { strict: true });

if (!valid) {
  console.error(errorMsg);
  process.exit(1);
}

console.log(chalk.white('✔️ validate extension.'));