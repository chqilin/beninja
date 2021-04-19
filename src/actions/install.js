const path = require('path');
const fs = require('fs-extra');
const common = require('../utils/common');

const installProject = async function(config, params) {
    const targets = config.targets;
    if(!targets || targets.length <= 0) {
        return;
    }

    const project = await common.getProjectInfo(config);

    for(let i = 0; i < targets.length; i++) {
        const target = await common.getTargetInfo(config, i);
        if(!target) {
            continue;
        }

        await installTarget(project, target);
    }
};

const installTarget = async function(project, target) {
    const installDir = path.join(project.installDir, target.name);
    fs.ensureDirSync(installDir);

    fs.copyFileSync(
        path.join(project.buildDir, target.name, target.file),
        path.join(installDir, target.file)
    );

    for(let i = 0; i < target.headers.length; i++) {
        const header = target.headers[i];

        fs.copyFileSync(
            header,
            path.join(installDir, path.basename(header))
        );
    }
};

module.exports = async function(config, params) {
    await installProject(config, params);
}
