"use strict";
exports.__esModule = true;
exports.inflateMediaLoader = void 0;
var bitecs_1 = require("bitecs");
var bit_components_1 = require("../bit-components");
var media_loading_1 = require("../bit-systems/media-loading");
function inflateMediaLoader(world, eid, _a) {
    var src = _a.src, recenter = _a.recenter, resize = _a.resize;
    (0, bitecs_1.addComponent)(world, bit_components_1.MediaLoader, eid);
    var flags = 0;
    if (recenter)
        flags |= media_loading_1.MEDIA_LOADER_FLAGS.RECENTER;
    if (resize)
        flags |= media_loading_1.MEDIA_LOADER_FLAGS.RESIZE;
    bit_components_1.MediaLoader.flags[eid] = flags;
    bit_components_1.MediaLoader.src[eid] = APP.getSid(src);
}
exports.inflateMediaLoader = inflateMediaLoader;
