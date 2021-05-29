import archiver from 'archiver';
import fs from 'fs';
import path from 'path';

/**
 * @param  {string} out
 * @returns {Promise<void>}
 */
const zipCurrentDir = async (out: string) => {
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
