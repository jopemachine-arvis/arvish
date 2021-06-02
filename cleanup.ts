#!/usr/bin/env node
import execa from 'execa';

(async () => {
  try {
    await execa('arvis-unlink', {
      preferLocal: true,
      localDir: __dirname
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
