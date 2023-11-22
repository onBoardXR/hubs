"use strict";
exports.__esModule = true;
exports.inflateModel = void 0;
var bitecs_1 = require("bitecs");
var bit_components_1 = require("../bit-components");
var jsx_entity_1 = require("../utils/jsx-entity");
function camelCase(s) {
    return s.replace(/-(\w)/g, function (_, m) { return m.toUpperCase(); });
}
function inflateModel(world, rootEid, _a) {
    var model = _a.model;
    var swap = [];
    model.traverse(function (obj) {
        var _a, _b;
        // TODO: Which of these need "?"
        var components = ((_b = (_a = obj.userData) === null || _a === void 0 ? void 0 : _a.gltfExtensions) === null || _b === void 0 ? void 0 : _b.MOZ_hubs_components) || {};
        var eid = obj === model ? rootEid : (0, bitecs_1.addEntity)(world);
        Object.keys(components).forEach(function (name) {
            var inflatorName = camelCase(name);
            if (!(0, jsx_entity_1.inflatorExists)(inflatorName)) {
                console.warn("Failed to inflate unknown component called ".concat(inflatorName));
                return;
            }
            jsx_entity_1.inflators[inflatorName](world, eid, components[name]);
        });
        var replacement = world.eid2obj.get(eid);
        if (replacement) {
            if (obj.type !== "Object3D") {
                console.error(obj, replacement);
                throw new Error("Failed to inflate model. Unexpected object type found before swap.");
            }
            if (obj === model) {
                throw new Error("Failed to inflate model. Can't inflate alternative object type on root scene.");
            }
            swap.push([obj, replacement]);
        }
        else {
            (0, jsx_entity_1.addObject3DComponent)(world, eid, obj);
        }
    });
    swap.forEach(function (_a) {
        var old = _a[0], replacement = _a[1];
        for (var i = old.children.length - 1; i >= 0; i--) {
            replacement.add(old.children[i]);
        }
        replacement.position.copy(old.position);
        replacement.quaternion.copy(old.quaternion);
        replacement.scale.copy(old.scale);
        replacement.matrixNeedsUpdate = true;
        // Re-use the the uuid for animation targeting.
        // TODO: This is weird... Should we be rewriting the animations instead?
        replacement.uuid = old.uuid;
        old.parent.add(replacement);
        old.removeFromParent();
    });
    (0, bitecs_1.addComponent)(world, bit_components_1.GLTFModel, rootEid);
    // TODO Animation Mixer
}
exports.inflateModel = inflateModel;
