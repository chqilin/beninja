const glob = require('glob');

exports.getFiles = glob;

exports.getFilesByPattern = async function (pattern) {
    return await new Promise((resolve, reject) => {
        glob(pattern, (err, files) => {
            if (err) {
                return reject(err);
            }
            return resolve(files);
        })
    })
};

exports.getFilesByPatternList = async function(patterns) {
    if(!patterns || patterns.length <= 0) {
        return [];
    }

    const result = [];
    for (let i = 0; i < patterns.length; i++) {
        const pattern = patterns[i];
        const files = await exports.getFilesByPattern(pattern);
        files.forEach(f => {
            result.push(f);
        });
    }
    return result;
};
