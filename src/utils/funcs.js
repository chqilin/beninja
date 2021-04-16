const path = require('path');

exports.getNinjaFilePath = function(config) {
    const absolutePath = path.resolve(`${config.out_dir || './'}`, `${config.project}.ninja`);
    return path.relative(process.cwd(), absolutePath);
}