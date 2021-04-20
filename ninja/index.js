const path = require('path');
const childProcess = require('child_process');
const os = require('os');

module.exports = async (args) => {
    return await new Promise((resolve, reject) => {
        const ext = os.type() === 'Windows_NT' ? '.exe' : '';
        const cmd = path.join(__dirname, `/bin/${os.type()}/ninja${ext}`);

        const ninja = childProcess.spawn(cmd, args);
        ninja.stdout.on('data', (data) => {
            const msg = `${data}`;
            console.error(msg.startsWith('ninja:') ? msg : `ninja: ${msg}`);
        });
        ninja.stderr.on('data', (data) => {
            const msg = `${data}`;
            console.error(msg.startsWith('ninja:') ? msg : `ninja: ${msg}`);
        });
        ninja.on('close', (code) => {
            if (code) {
                console.log('ninja:', `exited with code: ${code}`);
            }
            else {
                console.log('ninja', 'done');
            }
            resolve(code);
        });
        ninja.on('error', (err)=>{
            reject(err);
        });
    });
};
