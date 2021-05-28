import archiver from 'archiver';
import fs from 'fs';

/**
 * @param  {string} out
 * @returns {Promise<void>}
 */
const zipCurrentDir = (out: string) => {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive
      .glob('**', {
        cwd: __dirname,
        ignore: ['^[.]*', 'package-lock.json', 'yarn.lock']
      })
      .on('error', reject)
      .pipe(stream);

    stream.on('close', resolve);
    archive.finalize();
  });
};

export {
  zipCurrentDir
};
