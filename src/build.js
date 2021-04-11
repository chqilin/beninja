const path = require('path');
const fs = require('fs');
const { globAsync } = require('./glob');

exports.buildTargetAsync = async function (stream, target) {
    /**
         * name
         */
    let name = target.name || 'a';
    let type = target.type || 'dynamic';

    let outFileExt = '.a';
    if (type === 'dynamic') {
        outFileExt = '.so';
    }

    let outFileName = `${name}${outFileExt}`;
    let outFileDir = target.out_dir || projectDir;
    const outFilePath = path.join(outFileDir, outFileName);
    console.log('outFileName', outFileName);
    console.log('outFileDir', outFilePath);

    /**
     * cflags
     */
    let cflags = ''
    if (target.cflags) {
        cflags = target.cflags.join(' ');
    }
    console.log('cflags', cflags);

    /**
     * include_dirs
     */
    const includeDirs = [];
    if (target.include_dirs && target.include_dirs.length > 0) {
        target.include_dirs.forEach(dir => {
            dir = path.resolve(dir);
            includeDirs.push(dir);
            console.log('include', dir);
        });
    }

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
            const files = await globAsync(src);
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

        const outpath = `${path.join(outFileDir, basename)}.o`;
        stream.write(`build ${outpath}: cc ${src}\n    cflags = ${cflags} \n`);

        outputs.push(outpath);
    });
    stream.write('\n');

    if (type === 'static') {
        stream.write(`build ${outFilePath}: ar ${outputs.join(' ')}\n`);
    }
    else if (type == 'dynamic') {
        stream.write(`build ${outFilePath}: so ${outputs.join(' ')}\n`);
    }
    stream.write(`\n`);
};

exports.buildAsync = async function (config) {
    const project = config.project;

    const stream = fs.createWriteStream(`./build.ninja`);

    stream.write(`ninja_required_version = 1.10\n`);
    stream.write(`\n`);

    stream.write(`builddir = ${config.out_dir}\n`);
    stream.write(`cflags = -Wall -std=c++20 -O3 \n`);
    stream.write(`\n`);

    stream.write(`rule cc \n`);
    stream.write(`    command = clang++ $cflags -c $in -o $out \n`);

    stream.write(`rule ar \n`);
    stream.write(`    command = ar -r $out $in \n`);

    stream.write(`rule so \n`);
    stream.write(`    command = clang++ $in -shared -fPIC -o $out \n`);
    stream.write(`\n`);

    const targets = config.targets;
    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        await exports.buildTargetAsync(stream, target);
    }

    stream.close();
};
