const readline = require('../utils/readline');

module.exports = async function(config, params) {
    const stream = readline.create();
    const yes = await stream.question('create a new build system ?');
    console.log(yes);
    stream.close();
}
