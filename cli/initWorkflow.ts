import fse from 'fs-extra';
import path from 'path';
import pathExists from 'path-exists';
import username from 'username';

const skeleton = {
  $schema:
    'https://raw.githubusercontent.com/jopemachine/arvis-extension-validator/master/workflow-schema.json',
  creator: '',
  name: '',
  enabled: true,
  description: '',
  readme: '',
  version: '0.0.1',
  webAddress: '',
  commands: []
};

export default async (name?: string) => {
  skeleton.name = name ?? path.basename(process.cwd());

  const pkgPath = path.resolve(process.cwd(), 'package.json');
  const pkgExist = await pathExists(pkgPath);

  if (pkgExist) {
    const pkg = await fse.readJson(pkgPath);
    skeleton.webAddress = pkg.homepage || '';
    skeleton.description = pkg.description || '';
    skeleton.version = pkg.version || '0.0.1';
  }

  try {
    skeleton.creator = (await username()) ?? '';
  } catch (err) {
    // skip initialize value
  }

  await fse.writeJSON(
    path.resolve(process.cwd(), 'arvis-workflow.json'),
    skeleton,
    {
      encoding: 'utf8',
      spaces: 4
    }
  );
};
