import { checkUpdate } from 'arvis-notifier';
import findUp from 'find-up';
import fse from 'fs-extra';

export default async () => {
  const path = await findUp(['package.json']);
  if (!path) {
      throw new Error('Extension\'s package.json not found!');
  }

  const pkg = await fse.readJSON(path);
  const arvish = pkg.arvish || {};

  if (arvish.updateNotification !== false) {
    checkUpdate();
  }
};