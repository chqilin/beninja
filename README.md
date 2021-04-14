# beninja

a small meta-build-tool for ninja.

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
    "project": "libarchaism",
    "version": "1.0.0",
    "out_dir": "./_out",
    
    "targets": [{
        "name": "libarchaism",
        "type": "dynamic", // executable | static | dynamic
        "out_dir": "./_out",

        "cflags": [
            "-g", "-std=c++11"
        ],

        "lflags": [],

        "includes": [
            "./src"
        ],

        "libraries": [
            "-Ldir",
            "-llib"
        ],

        "sources": [
            "./src/**.cpp"
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
```

## LICENSE
ISC
