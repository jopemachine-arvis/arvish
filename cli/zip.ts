import archiver from 'archiver';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';
import { error } from './utils';
import { validate as validateJson } from 'arvis-extension-validator';

/**
 * @param  {string} type
 */
export const zipExtensionFolder = async (
  source: string,
  type: 'workflow' | 'plugin'
): Promise<void> => {
  try {
    const json = await fse.readJSON(
      `${process.cwd()}${path.sep}arvis-${type}.json`
    );

    const { errorMsg, valid } = validateJson(json, type);

    if (!valid) {
      error(`Error: It seems that arvis-${type}.json file is not valid\n`);
      error(errorMsg);
      return;
    }

    const bundleId = `${json.creator}.${json.name}`;
    const target = `${source}${path.sep}${bundleId}.arvis${type}`;
    console.log(chalk.cyan(`Creating '${target}'.. please wait..`));

    await zipCurrentDir(source, target);
  } catch (err) {
    console.error(err);
  }
};

/**
 * @param  {string} out
 * @returns {Promise<void>}
 */
const zipCurrentDir = async (source: string, out: string): Promise<void> => {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(out);
  const targetFileName = out.split(path.sep).pop();
  if (!targetFileName) throw new Error('Target file name not exist');

  return new Promise((resolve, reject) => {
    archive
      .glob('**', {
        cwd: source,
        ignore: ['^[.]*', 'package-lock.json', 'yarn.lock', targetFileName]
      })
      .on('error', reject)
      .pipe(stream);

    stream.on('close', resolve);
    archive.finalize();
  });
};

export { zipCurrentDir };
