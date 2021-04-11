
const program = require('commander');
const path = require('path');
const package = require('../package.json');

const { buildAsync } = require('./build');

program
    .version(package.version, '-v, --version', 'output current version.');

program
    .command('build [file]')
    .description('build from [file]')
    .action((file)=>{
        const filePath = path.resolve(process.cwd(), file || './build.json');
        const config = require(filePath);
        buildAsync(config);
    });

program.parse(process.argv);
