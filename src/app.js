
const program = require('commander');
const path = require('path');
const spawn = require('cross-spawn');
const package = require('../package.json');

const { buildAsync } = require('./build');

program
    .version(package.version, '-v, --version', 'output current version.');

program
    .command('build [file]')
    .description('build from [file]')
    .action((file) => {
        try {
            const filePath = path.resolve(process.cwd(), file || './build.json');
            console.log(`build ${filePath}`);
            const config = require(filePath);
            buildAsync(config);
        }
        catch (err) {
            console.error(err.message);
        }
    });

program
    .command('make')
    .description('make targets by *.ninja')
    .action(()=>{
        console.log(`ninja -f ./build.ninja`);
        const ret = spawn.sync('ninja', ['-f', 'build.ninja'], {encoding: 'utf-8'});
        if(ret.stderr) {
            console.error(ret.stderr);
        }
        else {
            console.log(ret.stdout);
        }
    });

program.parse(process.argv);
