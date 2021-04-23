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

const applyVars = (value, vars) => {
    if (!value || !vars || vars.length <= 0) {
        return value;
    }
    value = value.toString();
    for (let k in vars) {
        let v = vars[k];
        value = value.replace(`$\{${k}\}`, v);
    }
    return value;
}

exports.getProjectInfo = async (config) => {
    const vars = config.vars || {};

    const info = {
        name: applyVars(config.project, vars),
        version: applyVars(config.version, vars),
        buildDir: applyVars(config.buildDir || './_build', vars),
        installDir: applyVars(config.installDir || './_install', vars),
    };

    info.ninja = path.join(info.buildDir, `${info.name || 'build'}.ninja`);

    return info;
};

exports.getTargetInfo = async (config, index) => {
    if (!config.targets || config.targets.length <= index) {
        return null;
    }

    const vars = config.vars || {};
    const conf = config.targets[index];

    const info = {
        name: applyVars(conf.name || 'a', vars),
        type: applyVars(conf.type || 'executable', vars),
    };

    info.ext = getTargetExt(info.type);
    info.file = `${info.name}${info.ext}`;

    if (conf.cflags && conf.cflags.length > 0) {
        info.cflags = conf.cflags.join(' ');
        info.cflags = applyVars(info.cflags, vars);
    }

    if (conf.lflags && conf.lflags.length > 0) {
        info.lflags = conf.lflags.join(' ');
        info.lflags = applyVars(info.lflags, vars);
    }

    if (conf.includes && conf.includes.length > 0) {
        info.includes = conf.includes.join(' ');
        info.includes = applyVars(info.includes, vars);
    }

    if (conf.libraries && conf.libraries.length > 0) {
        info.libraries = conf.libraries.join(' ');
        info.libraries = applyVars(info.libraries, vars);
    }

    if (conf.runtimes && conf.runtimes.length > 0) {
        info.runtimes = `-rpath ${conf.runtimes.join(':')}`;
        info.runtimes = applyVars(info.runtimes, vars);
    }

    info.headers = await glob.getFilesByPatternList(
        conf.headers.map(h => applyVars(h, vars))
    );

    info.sources = await glob.getFilesByPatternList(
        conf.sources.map(s => applyVars(s, vars))
    );

    return info;
};
