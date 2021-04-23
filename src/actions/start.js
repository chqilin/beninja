const vars = require('./vars');
const build = require('./build');
const make = require('./make');
const install = require('./install');
const clean = require('./clean');

const delay = async(s)=>{
    return await new Promise((resolve, reject)=>{
        setTimeout(resolve, s * 1000);
    });
}

module.exports = async function(config, params) {
    console.log('==> step 1:', 'vars ...');
    await vars(config, params);
    await delay(1.0);
    console.log(' ');

    console.log('==> step 2:', 'clean ...');
    await clean(config, params);
    await delay(1.0);
    console.log(' ');

    console.log('==> step 3:', 'build ...');
    await build(config, params);
    await delay(1.0);
    console.log(' ');

    console.log('==> step 4:', 'make ...');
    await make(config, params);
    await delay(1.0);
    console.log(' ');

    console.log('==> step 5:', 'install ...');
    await install(config, params);
    await delay(1.0);
    console.log(' ');
}