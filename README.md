# beninja

a small C/C++ meta-build-tool for ninja.

## Install
* install nodejs from https://nodejs.org
* execute command in system Terminal
```
npm install -g beninja
```

## build.json
Beninja need a build config file (build.json default). So we must
create this json file manually. the file content just like:
```
{
    "project": "eokas",
    "version": "0.0.1",
    "buildDir": "_build",
    "installDir": "_install",

    "vars": {
        "depsDir": "./deps/",
        "cflags": "-O3 -std=c++17"
    },

    "targets": [{
        "name": "eokas",
        "type": "executable",
    
        "cflags": ["${cflags}"],

        "lflags": [],

        "includes": [
            "-I${depsDir}"
        ],

        "libraries": [
            "-L${depsDir}",
            "-larchaism"
        ],

        "runtimes": [
            "@executable_path"
        ],

        "headers": [],

        "sources": [
            "./src/*.cpp"
        ]
    }]
}
```

## Usage
* use beninja with one command.
```
beninja start
```

* use beninja step by step.
```
// list all vars
beninja vars

// build.json -> build.ninja
beninja build

// build targets by build.ninja
beninja make

// install targets and headers.
beninja install

// clean build files
beninja clean
```

## LICENSE

ISC
