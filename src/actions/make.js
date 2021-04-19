const spawn = require('cross-spawn');
const common = require('../utils/common');

module.exports = async function (config, params) {
    const project = await common.getProjectInfo(config);
    console.log(`ninja -f ${project.ninja}`);

    const ret = spawn.sync('ninja', ['-f', project.ninja], { encoding: 'utf-8' });
    if (ret.stderr) {
        console.error(ret.stderr);
    }
    else {
        console.log(ret.stdout);
    }
}
