# beninja

a small C/C++ meta-build-tool for ninja.

## Install
* install ninja from https://ninja-build.org
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
    "out_dir": "dist",

    "targets": [{
        "name": "eokas",
        "type": "executable",
    
        "cflags": [
            "-O3 -std=c++17"
        ],

        "lflags": [],

        "includes": [
            "-I./deps/"
        ],

        "libraries": [
            "-L./deps",
            "-larchaism"
        ],

        "sources": [
            "./src/*.cpp"
        ]
    }]
}
```

## Usage
```
// build.json -> build.ninja
beninja build [file, default './build.json']

// build targets by build.ninja
beninja make

// clean build files
beninja clean
```

## LICENSE

ISC
