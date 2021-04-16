const path = require('path');
const { action } = require("commander");

module.exports = function (name, conf) {
    return async (params) => {
        try {
            if (conf) {
                const file = path.resolve(process.cwd(), conf);
                const config = require(file);
                const action = require(`./${name}`);
                await action(config, params);
            }
            else {
                action({}, params);
            }
        }
        catch (err) {
            console.error(err.message);
        }
    };
};