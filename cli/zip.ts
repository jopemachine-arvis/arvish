import archiver from 'archiver';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';
import { error } from './utils';

/**
 * @param  {string} type
 */
export const zipExtensionFolder = async (type: string) => {
  try {
    const json = await fse.readJSON(
      `${process.cwd()}${path.sep}arvis-${type}.json`
    );
    if (!json.bundleId) {
      error(`Error: It seems that arvis-${type}.json file is not valid`);
    }

    const target = `${process.cwd()}${path.sep}${json.bundleId}.arvis${type}`;
    console.log(chalk.cyan(`Creating '${target}'.. please wait..`));

    await zipCurrentDir(target);
  } catch (err) {
    console.error(err);
  }
};

/**
 * @param  {string} out
 * @returns {Promise<void>}
 */
const zipCurrentDir = async (out: string): Promise<void> => {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(out);
  const targetFileName = out.split(path.sep).pop();
  if (!targetFileName) throw new Error('Target file name not exist');

  return new Promise((resolve, reject) => {
    archive
      .glob('**', {
        cwd: process.cwd(),
        ignore: ['^[.]*', 'package-lock.json', 'yarn.lock', targetFileName]
      })
      .on('error', reject)
      .pipe(stream);

    stream.on('close', resolve);
    archive.finalize();
  });
};

export { zipCurrentDir };
