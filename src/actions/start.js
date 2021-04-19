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
    await clean(config, params);
    await delay(1.0);

    await build(config, params);
    await delay(1.0);

    await make(config, params);
    await delay(1.0);

    await install(config, params);
    await delay(1.0);
}