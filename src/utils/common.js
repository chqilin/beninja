const path = require('path');
const fs = require('fs');

exports.getNinjaFilePath = function(config) {
    return path.join(`${config.out_dir || './'}`, `${config.project || 'build'}.ninja`);
};

exports.getTargetOutDir = function(outdir, name) {
    return path.join(outdir, name);
};

exports.getTargetFileName = function(name, type) {
    let ext = '';
    if (type === 'static') {
        ext = '.a';
    }
    else if (type === 'dynamic') {
        ext = '.so';
    }

    return `${name}${ext}`;
};
