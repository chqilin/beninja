# beninja

a small C/C++ meta-build-tool for ninja.

## Install
* install nodejs from https://nodejs.org
* execute command in system Terminal
```shell
npm install -g beninja
```

* On Windows system, you need do the steps below:
1. Install clang: https://github.com/llvm/llvm-project/releases/tag/llvmorg-12.0.1 .
2. Open PowerShell and execute command below:
```shell
set-ExecutionPolicy -Scope CurrentUser RemoteSigned
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

        "defines": [
            "_WINDOW_WIDTH=800",
            "_WINDOW_HEIGHT=600",
            "_WINDOW_TITLE=\"my-demo\""
        ],

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

        "sources": [
            "./src/*.cpp"
        ],

        "copies": [
            "./src/*.h"
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
