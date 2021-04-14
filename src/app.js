
const program = require('commander');
const path = require('path');

const package = require('../package.json');
const init = require('./init');
const build = require('./build');
const make = require('./make');
const install = require('./install');

program
    .version(package.version, '-v, --version', 'output current version.');

program
    .command('init')
    .description('init a build.json')
    .action(() => {
        init();
    });

program
    .command('build [file]')
    .description('build from [file]')
    .action((file) => {
        build(file);
    });

program
    .command('make')
    .description('make targets by *.ninja')
    .action(() => {
        make();
    });

program
    .command('install [directory]')
    .description('install files to a directory.')
    .action((dir) => {
        install(dir);
    });

program.parse(process.argv);
