import getHelpStr from './getHelpStr';
import meow from 'meow';
import initPlugin from './initPlugin';
import initWorkflow from './initWorkflow';
import { zipCurrentDir } from './zip';

/**
 * @param  {string[]} input
 * @param  {any} flags?
 * @summary cli main function
 */
const cliFunc = async (input: string[], flags?: any) => {
  switch (input[0]) {
    case 'init': {
      if (input[1] === 'plugin') initPlugin();
      else if (input[1] === 'workflow') initWorkflow();
      else console.error("Specify second argument as 'workflow' or 'plugin'");
      break;
    }
    case 'zip':
      await zipCurrentDir(__dirname);
      break;
  }

  return '';
};

const cli = meow(getHelpStr());

console.log(cli.input);

(async () => {
  console.log(await cliFunc(cli.input, cli.flags));
})();
