"use strict";
exports.__esModule = true;
exports.renderAsEntity = exports.inflatorExists = exports.inflators = exports.swapObject3DComponent = exports.addObject3DComponent = exports.createElementEntity = exports.resolveRef = exports.createRef = exports.Ref = void 0;
var bitecs_1 = require("bitecs");
var troika_three_text_1 = require("troika-three-text");
var bit_components_1 = require("../bit-components");
var media_loader_1 = require("../inflators/media-loader");
var media_frame_1 = require("../inflators/media-frame");
var grabbable_1 = require("../inflators/grabbable");
var image_1 = require("../inflators/image");
var video_1 = require("../inflators/video");
var model_1 = require("../inflators/model");
var slice9_1 = require("../inflators/slice9");
var text_1 = require("../inflators/text");
var three_1 = require("three");
var preload_1 = require("./preload");
(0, preload_1.preload)(new Promise(function (resolve) {
    (0, troika_three_text_1.preloadFont)({ characters: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_<()>[]|0123456789" }, resolve);
}));
var reservedAttrs = ["position", "rotation", "scale", "visible", "name", "layers"];
var Ref = /** @class */ (function () {
    function Ref() {
        this.current = null;
    }
    return Ref;
}());
exports.Ref = Ref;
function createRef() {
    return new Ref();
}
exports.createRef = createRef;
function resolveRef(world, ref) {
    if (ref.current === null) {
        ref.current = (0, bitecs_1.addEntity)(world);
    }
    return ref.current;
}
exports.resolveRef = resolveRef;
function isReservedAttr(attr) {
    return reservedAttrs.includes(attr);
}
function createElementEntity(tag, attrs) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    attrs = attrs || {};
    if (typeof tag === "function") {
        return tag(attrs, children);
    }
    else if (tag === "entity") {
        var outputAttrs = {};
        var components = {};
        var ref = undefined;
        for (var attr in attrs) {
            if (isReservedAttr(attr)) {
                outputAttrs[attr] = attrs[attr];
            }
            else if (attr === "ref") {
                ref = attrs[attr];
            }
            else {
                // if jsx transformed the attr into attr: true, change it to attr: {}.
                var c = attr;
                components[c] = attrs[c] === true ? {} : attrs[c];
            }
        }
        return {
            attrs: outputAttrs,
            components: components,
            children: children.flat(),
            ref: ref
        };
    }
    else {
        throw new Error("invalid tag \"".concat(tag, "\""));
    }
}
exports.createElementEntity = createElementEntity;
function addObject3DComponent(world, eid, obj) {
    if ((0, bitecs_1.hasComponent)(world, bit_components_1.Object3DTag, eid)) {
        throw new Error("Tried to add an object3D tag to an entity that already has one");
    }
    (0, bitecs_1.addComponent)(world, bit_components_1.Object3DTag, eid);
    world.eid2obj.set(eid, obj);
    obj.eid = eid;
    return eid;
}
exports.addObject3DComponent = addObject3DComponent;
function swapObject3DComponent(world, eid, obj) {
    if (!(0, bitecs_1.hasComponent)(world, bit_components_1.Object3DTag, eid)) {
        throw new Error("Tried to swap Object3D aon an entity that does not have the object3D tag");
    }
    var oldObj = world.eid2obj.get(eid);
    oldObj.eid = 0;
    world.eid2obj.set(eid, obj);
    obj.eid = eid;
    return eid;
}
exports.swapObject3DComponent = swapObject3DComponent;
// TODO HACK gettting internal bitecs symbol, should expose an API to check a properties type
var $isEidType = Object.getOwnPropertySymbols(bit_components_1.CameraTool.screenRef).find(function (s) { return s.description === "isEidType"; });
var createDefaultInflator = function (C, defaults) {
    if (defaults === void 0) { defaults = {}; }
    return function (world, eid, componentProps) {
        componentProps = Object.assign({}, defaults, componentProps);
        (0, bitecs_1.addComponent)(world, C, eid, true);
        Object.keys(componentProps).forEach(function (propName) {
            var prop = C[propName];
            if (!prop) {
                console.error("".concat(propName, " is not a valid property of"), C);
                return;
            }
            var value = componentProps[propName];
            if (prop[bit_components_1.$isStringType]) {
                if (value && typeof value !== "string") {
                    throw new TypeError("Expected ".concat(propName, " to be a string, got an ").concat(typeof value, " (").concat(value, ")"));
                }
                prop[eid] = APP.getSid(value);
            }
            else if (prop[$isEidType]) {
                prop[eid] = resolveRef(world, value);
            }
            else {
                prop[eid] = value;
            }
        });
    };
};
exports.inflators = {
    cursorRaycastable: createDefaultInflator(bit_components_1.CursorRaycastable),
    remoteHoverTarget: createDefaultInflator(bit_components_1.RemoteHoverTarget),
    isNotRemoteHoverTarget: createDefaultInflator(bit_components_1.NotRemoteHoverTarget),
    handCollisionTarget: createDefaultInflator(bit_components_1.HandCollisionTarget),
    offersRemoteConstraint: createDefaultInflator(bit_components_1.OffersRemoteConstraint),
    offersHandConstraint: createDefaultInflator(bit_components_1.OffersHandConstraint),
    singleActionButton: createDefaultInflator(bit_components_1.SingleActionButton),
    holdableButton: createDefaultInflator(bit_components_1.HoldableButton),
    textButton: createDefaultInflator(bit_components_1.TextButton),
    hoverButton: createDefaultInflator(bit_components_1.HoverButton),
    holdable: createDefaultInflator(bit_components_1.Holdable),
    deletable: createDefaultInflator(bit_components_1.Deletable),
    rigidbody: createDefaultInflator(bit_components_1.Rigidbody),
    physicsShape: createDefaultInflator(bit_components_1.PhysicsShape),
    floatyObject: createDefaultInflator(bit_components_1.FloatyObject),
    makeKinematicOnRelease: createDefaultInflator(bit_components_1.MakeKinematicOnRelease),
    destroyAtExtremeDistance: createDefaultInflator(bit_components_1.DestroyAtExtremeDistance),
    networkedTransform: createDefaultInflator(bit_components_1.NetworkedTransform),
    networked: createDefaultInflator(bit_components_1.Networked),
    cameraTool: createDefaultInflator(bit_components_1.CameraTool, { captureDurIdx: 1 }),
    animationMixer: createDefaultInflator(bit_components_1.AnimationMixer),
    networkedVideo: createDefaultInflator(bit_components_1.NetworkedVideo),
    videoMenu: createDefaultInflator(bit_components_1.VideoMenu),
    videoMenuItem: createDefaultInflator(bit_components_1.VideoMenuItem),
    textureCacheKey: createDefaultInflator(bit_components_1.TextureCacheKey),
    mediaLoader: media_loader_1.inflateMediaLoader,
    grabbable: grabbable_1.inflateGrabbable,
    // inflators that create Object3Ds
    mediaFrame: media_frame_1.inflateMediaFrame,
    object3D: addObject3DComponent,
    slice9: slice9_1.inflateSlice9,
    text: text_1.inflateText,
    model: model_1.inflateModel,
    image: image_1.inflateImage,
    video: video_1.inflateVideo
};
function inflatorExists(name) {
    return exports.inflators.hasOwnProperty(name);
}
exports.inflatorExists = inflatorExists;
function renderAsEntity(world, entityDef) {
    var eid = entityDef.ref ? resolveRef(world, entityDef.ref) : (0, bitecs_1.addEntity)(world);
    Object.keys(entityDef.components).forEach(function (name) {
        if (!inflatorExists(name)) {
            throw new Error("Failed to inflate unknown component called ".concat(name));
        }
        exports.inflators[name](world, eid, entityDef.components[name]);
    });
    var obj = world.eid2obj.get(eid);
    if (!obj) {
        obj = new three_1.Group();
        addObject3DComponent(world, eid, obj);
    }
    if (entityDef.attrs.position) {
        obj.position.fromArray(entityDef.attrs.position);
    }
    if (entityDef.attrs.rotation) {
        obj.rotation.fromArray(entityDef.attrs.rotation);
    }
    if (entityDef.attrs.scale) {
        obj.scale.fromArray(entityDef.attrs.scale);
    }
    if (entityDef.attrs.name) {
        obj.name = entityDef.attrs.name;
    }
    if (entityDef.attrs.layers !== undefined) {
        obj.layers.mask = entityDef.attrs.layers;
    }
    if (entityDef.attrs.visible !== undefined) {
        obj.visible = entityDef.attrs.visible;
    }
    entityDef.children.forEach(function (child) {
        var childEid = renderAsEntity(world, child);
        obj.add(world.eid2obj.get(childEid));
    });
    return eid;
}
exports.renderAsEntity = renderAsEntity;
