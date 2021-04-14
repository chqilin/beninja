const path = require('path');
const fs = require('fs');
const { globAsync } = require('./glob');

const buildProject = async function (config) {
    const project = config.project;

    const stream = fs.createWriteStream(`./build.ninja`);

    stream.write(`ninja_required_version = 1.10\n`);
    stream.write(`\n`);

    stream.write(`builddir = ${config.out_dir}\n`);
    stream.write(`cflags = -Wall -std=c++20 -O3\n`);
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
        await exports.buildTargetAsync(stream, target);
    }

    stream.close();
};

const buildTargetAsync = async function (stream, target) {
    /**
         * name
         */
    let name = target.name || 'a';
    let type = target.type || 'executable';

    let outFileExt = '';
    if (type === 'static') {
        outFileExt = '.a';
    }
    else if (type === 'dynamic') {
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
        stream.write(`build ${outpath}: cc ${src}\n`);
        cflags && stream.write(`    cflags = ${cflags}\n`);
        includes && stream.write(`    includes = ${includes}\n`);

        outputs.push(outpath);
    });
    stream.write('\n');

    if (type === 'static') {
        stream.write(`build ${outFilePath}: ar ${outputs.join(' ')}\n`);
    }
    else if (type === 'dynamic') {
        stream.write(`build ${outFilePath}: so ${outputs.join(' ')}\n`);
        lflags && stream.write(`    lflags = ${lflags}\n`);
        libraries && stream.write(`    libraries = ${libraries}\n`);
    }
    else if (type === 'executable') {
        stream.write(`build ${outFilePath}: ex ${outputs.join(' ')}\n`);
        lflags && stream.write(`    lflags = ${lflags}\n`);
        libraries && stream.write(`    libraries = ${libraries}\n`);
    }

    stream.write(`\n`);
};

module.exports = async function(file) {
    try {
        const filePath = path.resolve(process.cwd(), file || './build.json');
        console.log(`build ${filePath}`);
        const config = require(filePath);
        await buildProject(config);
    }
    catch(err) {
        console.error(err.message);
    }
};
