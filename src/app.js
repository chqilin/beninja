
const program = require('commander');
const path = require('path');

const package = require('../package.json');

const action = function (name) {
    return async() => {
        try {
            const file = path.resolve(process.cwd(), './beninja.json');
            const conf = require(file);
            const func = require(`./${name}`);
            await func(conf);
        }
        catch (err) {
            console.error(err.message);
        }
    };
};

program
    .version(package.version, '-v, --version', 'output current version.');
program
    .command('init').action(action('init')).description('init a build system.');
program
    .command('build').action(action('build')).description('build low level build rules and tasks.');
program
    .command('make').action(action('make')).description('make targets.');
program
    .command('install').action(action('install')).description('install targets.');

program.parse(process.argv);
