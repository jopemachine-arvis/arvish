import fse from 'fs-extra';
import path from 'path';
import username from 'username';

const mock = {
  $schema:
    'https://raw.githubusercontent.com/jopemachine/arvis-extension-validator/master/plugin-schema.json',
  creator: '',
  name: '',
  enabled: true,
  description: '',
  platform: [process.platform],
  readme: '',
  version: '0.0.1',
  webAddress: '',
  actions: []
};

export default async (name?: string) => {
  if (name) {
    mock.name = name;
  } else {
    mock.name = path.dirname(process.cwd());
  }

  try {
    mock.creator = (await username()) ?? '';
  } catch (err) {
    // skip initialize value
  }

  await fse.writeJSON(path.resolve(process.cwd(), 'arvis-plugin.json'), mock, {
    encoding: 'utf8',
    spaces: 4
  });
};
