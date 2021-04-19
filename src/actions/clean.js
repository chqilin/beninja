const path = require('path');
const fs = require('fs-extra');
const common = require('../utils/common');

const isSafePathToDelete = async(config, params, candidatePath) => {
    const targets = config && config.targets;
    if(!targets || targets.length <= 0) {
        return true;
    }

    const absolutePath = path.resolve(candidatePath);

    for(let i = 0; i < targets.length; i++) {
        const target = targets[i];
        if(!target) {
            continue;
        }

        const sources = target.sources;
        if(!sources || sources.length <= 0) {
            continue;
        }

        for(let s = 0; s < sources.length; s++) {
            const sourcePath = path.resolve(sources[i]);
            if(sourcePath.startsWith(absolutePath)) {
                return false;
            }
        }
    }

    return true;
}

module.exports = async function(config, params) {
    const project = await common.getProjectInfo(config);

    if(isSafePathToDelete(config, params, project.buildDir)) {
        fs.removeSync(project.buildDir);
        console.log('removed:', project.buildDir);
    }

    if(isSafePathToDelete(config, params, project.installDir)) {
        fs.removeSync(project.installDir);
        console.log('removed:', project.installDir);
    }
}
