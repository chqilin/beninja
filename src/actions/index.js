const path  = require('path');

module.exports = function (name, conf) {
    return async (params) => {
        if (!conf) {
            return;
        }

        try {
            console.log(`${name} ...`);
            const configPath = path.resolve(conf);
            const config = require(configPath);
            const action = require(`./${name}`);
            await action(config, params);
            console.log(`done.`);
        }
        catch (err) {
            console.error(err.message);
        }
    };
};