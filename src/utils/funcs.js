const path = require('path');
const fs = require('fs');

exports.getNinjaFilePath = function(config) {
    return path.join(`${config.out_dir || './'}`, `${config.project || 'build'}.ninja`);
}