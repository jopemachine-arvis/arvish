import fse from 'fs-extra';
import path from 'path';

const mock = {
  $schema: './workflow-schema.json',
  creator: '',
  name: '',
  enabled: true,
  description: '',
  platform: [process.platform],
  readme: '',
  version: '0.0.1',
  webAddress: '',
  commands: []
};

export default async (name?: string) => {
  if (name) {
    mock.name = name;
  }

  await fse.writeJSON(`${process.cwd()}${path.sep}arvis-workflow.json`, mock, {
    encoding: 'utf8',
    spaces: 4
  });
};
