import execa from 'execa';

const executeCommand = async (command: string, args: string[]) => {
  try {
    return new Promise<void>((resolve, reject) => {
      const proc = execa('arvis-store', [command, ...args], {
        preferLocal: true,
        localDir: __dirname,
      });

      proc.stdout!.pipe(process.stdout);
      proc.stderr!.pipe(process.stderr);

      proc.on('close', () => {
        resolve();
      });
      proc.on('error', (err) => {
        reject(err);
      });
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const view = async (args: string[]) => {
  await executeCommand('view', args);
};

const publish = async () => {
  await executeCommand('publish', []);
};

export {
  view,
  publish
};
