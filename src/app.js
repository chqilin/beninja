
const program = require('commander');

const package = require('../package.json');
const actions = require('./actions');

const conf = './beninja.json';

program
    .version(package.version, '-v, --version', 'output current version.');

program
    .command('init')
    .action(actions('init'))
    .description('init a build system.');

program
    .command('start')
    .action(actions('start', conf))
    .description('start build-make-install with one command.');

program
    .command('build')
    .action(actions('build', conf))
    .description('build low level build rules and tasks.');

program
    .command('make')
    .action(actions('make', conf))
    .description('make targets.');

program
    .command('install')
    .action(actions('install', conf))
    .description('install targets.');

program
    .command('clean')
    .action(actions('clean', conf))
    .description('clean cached files.');

program.parse(process.argv);
