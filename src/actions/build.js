const path = require('path');
const fs = require('fs-extra');
const common = require('../utils/common');

const buildProject = async function (config, params) {
    const project = await common.getProjectInfo(config);
    console.log('build:', project.ninja);

    fs.ensureFileSync(project.ninja);
    const stream = fs.createWriteStream(project.ninja);

    stream.write(`ninja_required_version = 1.10\n`);
    stream.write(`\n`);

    stream.write(`builddir = ${project.buildDir}\n`);
    stream.write(`cflags = -Wall -std=c++17 -O3\n`);
    stream.write(`lflags = \n`);
    stream.write(`includes = \n`);
    stream.write(`libraries = \n`);
    stream.write(`runtimes = \n`);
    stream.write(`\n`);

    stream.write(`rule cc\n`);
    stream.write(`    command = clang++ -o $out $in -c $cflags $includes\n`);

    stream.write(`rule ar\n`);
    stream.write(`    command = ar -r $out $in\n`);

    stream.write(`rule so\n`);
    stream.write(`    command = clang++ -o $out $in -shared -fPIC $lflags $libraries $runtimes\n`);

    stream.write(`rule ex\n`);
    stream.write(`    command = clang++ -o $out $in $lflags $libraries $runtimes\n`);
    stream.write(`\n`);

    const targets = config.targets;
    for (let i = 0; i < targets.length; i++) {
        const target = await common.getTargetInfo(config, i);
        if (!target) {
            continue;
        }

        await buildTarget(project, target, stream);
    }

    stream.close();
};

const buildTarget = async function (project, target, stream) {
    const targetDir = path.join(project.buildDir, target.name);
    const targetPath = path.join(targetDir, target.file);

    console.log('target:', targetPath);
    target.cflags && console.log('cflags:', target.cflags);
    target.lflags && console.log('lflags', target.lflags);
    target.includes && console.log('includes:', target.includes);
    target.libraries && console.log('libraries:', target.libraries);
    target.runtimes && console.log('runtimes', target.runtimes);
    target.headers && console.log('headers', target.headers);
    target.sources && console.log('sources:', target.sources);

    const outputs = [];
    target.sources.forEach(src => {
        const bname = path.basename(src);
        const oname = `${bname.substring(0, bname.lastIndexOf('.'))}.o`;
        const opath = path.join(targetDir, oname);

        stream.write(`build ${opath}: cc ${src}\n`);
        target.cflags && stream.write(`    cflags = ${target.cflags}\n`);
        target.includes && stream.write(`    includes = ${target.includes}\n`);

        outputs.push(opath);
    });
    stream.write('\n');

    switch (target.type) {
        case 'static':
            stream.write(`build ${targetPath}: ar ${outputs.join(' ')}\n`);
            break;
        case 'dynamic':
            stream.write(`build ${targetPath}: so ${outputs.join(' ')}\n`);
            target.lflags && stream.write(`    lflags = ${target.lflags}\n`);
            target.libraries && stream.write(`    libraries = ${target.libraries}\n`);
            target.runtimes && stream.write(`    runtimes = ${target.runtimes}\n`);
            break;
        case 'executable':
            stream.write(`build ${targetPath}: ex ${outputs.join(' ')}\n`);
            target.lflags && stream.write(`    lflags = ${target.lflags}\n`);
            target.libraries && stream.write(`    libraries = ${target.libraries}\n`);
            target.runtimes && stream.write(`    runtimes = ${target.runtimes}\n`);
            break;
        default:
            console.log('Unknown target type:', target.type);
            break;
    }

    stream.write(`\n`);
};

module.exports = async function (config) {
    await buildProject(config);
};
