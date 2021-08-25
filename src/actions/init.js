const readline = require('../libs/readline');

module.exports = async function(config, params) {
    const stream = readline.create();
    const yes = await stream.question('Create a new build system ?');
    console.log(yes);
    stream.close();
}
