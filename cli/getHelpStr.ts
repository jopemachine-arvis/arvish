import chalk from 'chalk';

export default () =>
  chalk.whiteBright(`
Usage
    To add arvis-workflow.json skeleton to current directory,
        $ arvish init workflow

    To add arvis-plugin.json skeleton to current directory,
        $ arvish init plugin

    To convert alfredworkflow's info.plist to arvis-workflow.json,
        $ arvish convert
        $ arvish convert info.plist

    To zip arvis-extension's directory to installer file, 
        $ arvish zip
        $ arvish zip workflow /Users/user/Destop/some_extension

See README.md for more details.
`);
