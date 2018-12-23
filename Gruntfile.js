const pkg = require('./package.json');
const path = require('path');
const stemBuilder = require('@bloomstack/stem/builder');

module.exports = function(grunt) {
    stemBuilder(grunt, {
        src: "./src",
        stage: 3,
        tasks: {
            lib: true,
            esModule: true
        }
    });

}