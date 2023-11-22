"use strict";
exports.__esModule = true;
exports.preload = exports.waitForPreloads = void 0;
var preloads = [];
function waitForPreloads() {
    return Promise.all(preloads);
}
exports.waitForPreloads = waitForPreloads;
function preload(p) {
    preloads.push(p);
}
exports.preload = preload;
