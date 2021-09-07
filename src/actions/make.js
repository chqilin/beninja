const common = require('../core/common');
const ninja = require('../../ninja');

module.exports = async function (config, params) {
    const project = await common.getProjectInfo(config);
    console.log(`ninja -f ${project.ninja}`);
    await ninja(['-f', project.ninja]);
}
