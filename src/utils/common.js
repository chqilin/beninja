const path = require('path');
const fs = require('fs');
const glob = require('./glob');

const getTargetExt = (type) => {
    const exts = {
        'static': '.a',
        'dynamic': '.so',
    }
    return exts[type] || '';
}

exports.getProjectInfo = async (config) => {
    const info = {
        name: config.project,
        version: config.version,
        buildDir: config.buildDir || './_build',
        installDir: config.installDir || './_install',
    };

    info.ninja = path.join(info.buildDir, `${info.name || 'build'}.ninja`);

    return info;
};

exports.getTargetInfo = async (config, index) => {
    if (!config.targets || config.targets.length <= index) {
        return null;
    }

    const conf = config.targets[index];

    const info = {
        name: conf.name || 'a',
        type: conf.type || 'executable',
    };

    info.ext = getTargetExt(info.type);
    info.file = `${info.name}${info.ext}`;

    if (conf.cflags && conf.cflags.length > 0) {
        info.cflags = conf.cflags.join(' ');
    }

    if (conf.lflags && conf.lflags.length > 0) {
        info.lflags = conf.lflags.join(' ');
    }

    if (conf.includes && conf.includes.length > 0) {
        info.includes = conf.includes.join(' ');
    }

    if (conf.libraries && conf.libraries.length > 0) {
        info.libraries = conf.libraries.join(' ');
    }

    info.headers = await glob.getFilesByPatternList(conf.headers);
    info.sources = await glob.getFilesByPatternList(conf.sources);

    return info;
};
