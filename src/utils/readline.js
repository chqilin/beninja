const readline = require('readline');

exports.create = function () {
    const stream = readline.createInterface();
    return {
        question: async (ask, defaultAnswer) => {
            return await new Promise((resolve, reject) => {
                stream.question(ask, (answer) => {
                    resolve(answer || defaultAnswer);
                });
            })
        },
        close: () => {
            stream.close();
        },
    }
}
