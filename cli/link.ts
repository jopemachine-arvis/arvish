#!/usr/bin/env node
import execa from 'execa';

(async () => {
  try {
    await execa('arvis-link', {
      preferLocal: true,
      localDir: __dirname
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
