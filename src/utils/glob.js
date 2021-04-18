const glob = require('glob');

exports.getFiles = glob;

exports.getFilesAsync = async function (pattern) {
    return await new Promise((resolve, reject) => {
        glob(pattern, (err, files) => {
            if (err) {
                return reject(err);
            }
            return resolve(files);
        })
    })
};
