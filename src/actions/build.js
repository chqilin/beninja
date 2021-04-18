const path = require('path');
const fs = require('fs-extra');
const glob = require('../utils/glob');
const common = require('../utils/common');

const buildProject = async function (config, params) {
    const ninjaFilePath = common.getNinjaFilePath(config);
    console.log('Build to:', ninjaFilePath);

    fs.ensureFileSync(ninjaFilePath);
    const stream = fs.createWriteStream(ninjaFilePath);

    stream.write(`ninja_required_version = 1.10\n`);
    stream.write(`\n`);

    stream.write(`builddir = ${config.out_dir}\n`);
    stream.write(`cflags = -Wall -std=c++17 -O3\n`);
    stream.write(`lflags = \n`);
    stream.write(`includes = \n`);
    stream.write(`libraries = \n`);
    stream.write(`\n`);

    stream.write(`rule cc\n`);
    stream.write(`    command = clang++ -o $out $in -c $cflags $includes\n`);

    stream.write(`rule ar\n`);
    stream.write(`    command = ar -r $out $in\n`);

    stream.write(`rule so\n`);
    stream.write(`    command = clang++ -o $out $in -shared -fPIC $lflags $libraries\n`);

    stream.write(`rule ex\n`);
    stream.write(`    command = clang++ -o $out $in $lflags $libraries\n`);
    stream.write(`\n`);

    const targets = config.targets;
    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        await buildTargetAsync(stream, target, config.out_dir);
    }

    stream.close();
};

const buildTargetAsync = async function (stream, target, outdir) {
    let targetName = target.name || 'a';
    let targetType = target.type || 'executable';

    const targetDir = common.getTargetOutDir(outdir, targetName);
    const targetFile = common.getTargetFileName(targetName, targetType);
    const targetPath = path.join(targetDir, targetFile);
    console.log('target:', targetPath);

    /**
     * cflags
     */
    let cflags = ''
    if (target.cflags) {
        cflags = target.cflags.join(' ');
    }
    console.log('cflags', cflags);

    /**
     * lflags
     */
    let lflags = ''
    if (target.lflags) {
        lflags = target.lflags.join(' ');
    }
    console.log('lflags', lflags);

    /**
     * includes
     */
    let includes = '';
    if (target.includes && target.includes.length > 0) {
        includes = target.includes.join(' ');
    }
    console.log('includes:', includes);

    /**
     * libraries
     */
    let libraries = ''
    if (target.libraries && target.libraries.length > 0) {
        libraries = target.libraries.join(' ');
    }
    console.log('libraries', libraries);

    /**
     * sources
     */
    const sources = [];
    if (target.sources && target.sources.length > 0) {
        for (let i = 0; i < target.sources.length; i++) {
            const src = target.sources[i];
            const files = await glob.getFilesAsync(src);
            files.forEach(f => {
                sources.push(f);
            });
        }
    }
    console.log('sources', sources);

    const outputs = []
    sources.forEach(src => {
        let basename = path.basename(src);
        basename = basename.substring(0, basename.lastIndexOf('.'));

        const outpath = `${path.join(targetDir, basename)}.o`;
        stream.write(`build ${outpath}: cc ${src}\n`);
        cflags && stream.write(`    cflags = ${cflags}\n`);
        includes && stream.write(`    includes = ${includes}\n`);

        outputs.push(outpath);
    });
    stream.write('\n');

    if (targetType === 'static') {
        stream.write(`build ${targetPath}: ar ${outputs.join(' ')}\n`);
    }
    else if (targetType === 'dynamic') {
        stream.write(`build ${targetPath}: so ${outputs.join(' ')}\n`);
        lflags && stream.write(`    lflags = ${lflags}\n`);
        libraries && stream.write(`    libraries = ${libraries}\n`);
    }
    else if (targetType === 'executable') {
        stream.write(`build ${targetPath}: ex ${outputs.join(' ')}\n`);
        lflags && stream.write(`    lflags = ${lflags}\n`);
        libraries && stream.write(`    libraries = ${libraries}\n`);
    }

    stream.write(`\n`);
};

module.exports = async function (config) {
    await buildProject(config);
};
