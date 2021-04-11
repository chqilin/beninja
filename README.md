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
    "project": "project-name",
    "version": "1.0.0",
    "out_dir": "./_out",
    
    "targets": [{
        "name": "libarchaism",
        "type": "dynamic",
        "out_dir": "./_out",

        "cflags": [
            "-std=c++11",
            "-Wall"
        ],

        "include_dirs": [
            "./src"
        ],

        "libraries": [
            "-Ldir",
            "-lz", "-lxml2"
        ],

        "sources": [
            "./src/**.cpp"
        ]
    }]
}
```

## LICENSE
ISC
