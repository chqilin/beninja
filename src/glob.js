const glob = require('glob');

exports.glob = glob;

exports.globAsync = async function (pattern) {
    return await new Promise((resolve, reject) => {
        glob(pattern, (err, files) => {
            if (err) {
                return reject(err);
            }
            return resolve(files);
        })
    })
};
