import fse from 'fs-extra';
import path from 'path';

const mock = {
  $schema: './workflow-schema.json',
  createdby: '',
  name: '',
  enabled: true,
  bundleId: '',
  description: '',
  platform: [process.platform],
  readme: '',
  version: '0.0.1',
  webaddress: '',
  commands: []
};

export default async (bundleId?: string) => {
  if (bundleId) {
    mock.bundleId = bundleId;
  }

  await fse.writeJSON(`${process.cwd()}${path.sep}arvis-workflow.json`, mock, {
    encoding: 'utf8',
    spaces: 4
  });
};
