const archiver = require('archiver');

/**
 * @param  {string} source
 * @param  {string} out
 * @returns {Promise<void>}
 */
const zip = (out) => {
	const archive = archiver('zip', { zlib: { level: 9 } });
	const stream = fs.createWriteStream(out);

	return new Promise((resolve, reject) => {
		archive
			.glob('**', {
				cwd: __dirname,
				ignore: ['^[.]*', 'package-lock.json', 'yarn.lock'],
			})
			.on('error', (err) => reject(err))
			.pipe(stream);

		stream.on('close', () => resolve());
		archive.finalize();
	});
};

module.exports = {};
