const spawn = require('cross-spawn');

module.exports = async function (config, params) {
    console.log(`ninja -f ./build.ninja`);
    
    const ret = spawn.sync('ninja', ['-f', 'build.ninja'], { encoding: 'utf-8' });
    if (ret.stderr) {
        console.error(ret.stderr);
    }
    else {
        console.log(ret.stdout);
    }
}
