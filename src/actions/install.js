const path = require('path');
const fs = require('fs-extra');
const common = require('../utils/common');

const installProject = async function (config, params) {
    const targets = config.targets;
    if (!targets || targets.length <= 0) {
        return;
    }

    const project = await common.getProjectInfo(config);

    for (let i = 0; i < targets.length; i++) {
        const target = await common.getTargetInfo(config, i);
        if (!target) {
            continue;
        }

        console.log(`[${i + 1}/${targets.length}]`, 'install target:', target.name);
        await installTarget(project, target);
    }
};

const installTarget = async function (project, target) {
    const installDir = path.join(project.installDir, target.name);
    fs.ensureDirSync(installDir);

    // copy target.
    {
        const from = path.join(project.buildDir, target.name, target.file);
        const to = path.join(installDir, target.file);
        fs.copyFileSync(from, to);
        console.log('copy file:', to);
    }

    // copy files
    for (let i = 0; i < target.copies.length; i++) {
        const file = target.copies[i];

        const from = file;
        const to = path.join(installDir, path.basename(from));
        fs.copyFileSync(from, to);
        console.log('copy file:', to);
    }
};

module.exports = async function (config, params) {
    await installProject(config, params);
}
