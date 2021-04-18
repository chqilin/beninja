const spawn = require('cross-spawn');
const common = require('../utils/common');

module.exports = async function (config, params) {
    const ninjaFilePath = common.getNinjaFilePath(config);
    console.log(`ninja -f ${ninjaFilePath}`);

    const ret = spawn.sync('ninja', ['-f', ninjaFilePath], { encoding: 'utf-8' });
    if (ret.stderr) {
        console.error(ret.stderr);
    }
    else {
        console.log(ret.stdout);
    }
}
