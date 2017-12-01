#!/usr/bin/env node

'use strict';

(() => {
    var ArgumentParser = require('argparse').ArgumentParser,
        sass = require('node-sass'),
        parser = new ArgumentParser({
            addHelp: true,
            description: 'SASS-To-CSS compiler based on node-sass library',
            version: '1.0.0'
        }),
        data = [],
        args,
        out;
    parser.addArgument(['*'], { help: '.scss input files to build', nargs: '*' });
    parser.addArgument(['-o', '--out'], { help: '.css output file' });
    parser.addArgument(['-i', '--include-path'], { help: 'Path to .scss input files' });
    parser.addArgument(['-c', '--compressed'], { help: 'Compress output .css file', action: 'storeTrue' });
    args = parser.parseArgs();
    // input files are mandatory
    if (!args['*'] || args['*'].length === 0) {
        throw new Error('.scss input files are required');
    }
    // out file is mandatory too
    if (!args.out) {
        throw new Error('.css out file is required');
    }
    // content
    args['*'].forEach((src) => {
        data.push(`@import "${args.include_path ? args.include_path + '/' + src : src}";`);
    });
    // render content
    sass.render({
        data: data.join(''),
        outFile: args.out,
        outputStyle: args.compressed ? 'compressed' : 'nested'
    }, (error, result) => {
        var fs = require('fs');
        if (error) {
            throw error;
        }
        // save to file
        fs.writeFile(args.out, result.css, 'utf8', (error) => {
            if (error) {
                throw error;
            }
        });
    });
})();
