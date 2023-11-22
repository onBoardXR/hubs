"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
exports.__esModule = true;
exports.videoMenuSystem = void 0;
var bitecs_1 = require("bitecs");
var three_1 = require("three");
var MathUtils_1 = require("three/src/math/MathUtils");
var bit_components_1 = require("../bit-components");
var media_video_1 = require("../components/media-video");
var netcode_1 = require("../systems/netcode");
var paths_1 = require("../systems/userinput/paths");
var animate_1 = require("../utils/animate");
var coroutine_1 = require("../utils/coroutine");
var easing_1 = require("../utils/easing");
var three_utils_1 = require("../utils/three-utils");
var videoMenuQuery = (0, bitecs_1.defineQuery)([bit_components_1.VideoMenu]);
var hoverRightVideoQuery = (0, bitecs_1.defineQuery)([bit_components_1.HoveredRemoteRight, bit_components_1.MediaVideo]);
var hoverRightVideoEnterQuery = (0, bitecs_1.enterQuery)(hoverRightVideoQuery);
var hoverRightMenuItemQuery = (0, bitecs_1.defineQuery)([bit_components_1.HoveredRemoteRight, bit_components_1.VideoMenuItem]);
var sliderHalfWidth = 0.475;
function setCursorRaycastable(world, menu, enable) {
    var change = enable ? bitecs_1.addComponent : bitecs_1.removeComponent;
    change(world, bit_components_1.CursorRaycastable, menu);
    change(world, bit_components_1.CursorRaycastable, bit_components_1.VideoMenu.trackRef[menu]);
}
var intersectInThePlaneOf = (function () {
    var plane = new three_1.Plane();
    var ray = new three_1.Ray();
    return function intersectInThePlaneOf(obj, _a, intersection) {
        var position = _a.position, direction = _a.direction;
        ray.set(position, direction);
        plane.normal.set(0, 0, 1);
        plane.constant = 0;
        obj.updateMatrices();
        plane.applyMatrix4(obj.matrixWorld);
        ray.intersectPlane(plane, intersection);
    };
})();
var rightMenuIndicatorCoroutine = null;
var intersectionPoint = new three_1.Vector3();
function videoMenuSystem(world, userinput) {
    var rightVideoMenu = videoMenuQuery(world)[0];
    var shouldHideVideoMenu = bit_components_1.VideoMenu.videoRef[rightVideoMenu] &&
        (!(0, bitecs_1.entityExists)(world, bit_components_1.VideoMenu.videoRef[rightVideoMenu]) ||
            (!hoverRightVideoQuery(world).length &&
                !hoverRightMenuItemQuery(world).length &&
                !(0, bitecs_1.hasComponent)(world, bit_components_1.Held, bit_components_1.VideoMenu.trackRef[rightVideoMenu])));
    if (shouldHideVideoMenu) {
        var menu = rightVideoMenu;
        var menuObj = world.eid2obj.get(menu);
        menuObj.removeFromParent();
        setCursorRaycastable(world, menu, false);
        bit_components_1.VideoMenu.videoRef[menu] = 0;
    }
    hoverRightVideoEnterQuery(world).forEach(function (eid) {
        var menu = rightVideoMenu;
        bit_components_1.VideoMenu.videoRef[menu] = eid;
        var menuObj = world.eid2obj.get(menu);
        var videoObj = world.eid2obj.get(eid);
        videoObj.add(menuObj);
        // TODO: Fix add in threejs
        // TODO remove should also reset matrixWorld to cachedMatrixWorld
        menuObj.matrixWorldNeedsUpdate = true;
        menuObj.childrenNeedMatrixWorldUpdate = true;
        setCursorRaycastable(world, menu, true);
    });
    videoMenuQuery(world).forEach(function (eid) {
        var videoEid = bit_components_1.VideoMenu.videoRef[eid];
        if (!videoEid)
            return;
        var menuObj = world.eid2obj.get(eid);
        var video = world.eid2obj.get(videoEid).material.map.image;
        var togglePlayVideo = userinput.get(paths_1.paths.actions.cursor.right.togglePlayVideo);
        if (togglePlayVideo) {
            if ((0, bitecs_1.hasComponent)(world, bit_components_1.NetworkedVideo, videoEid)) {
                (0, netcode_1.takeOwnership)(world, videoEid);
            }
            var playIndicatorObj = world.eid2obj.get(bit_components_1.VideoMenu.playIndicatorRef[eid]);
            var pauseIndicatorObj = world.eid2obj.get(bit_components_1.VideoMenu.pauseIndicatorRef[eid]);
            if (video.paused) {
                video.play();
                playIndicatorObj.visible = true;
                pauseIndicatorObj.visible = false;
                rightMenuIndicatorCoroutine = (0, coroutine_1.coroutine)(animateIndicator(world, bit_components_1.VideoMenu.playIndicatorRef[eid]));
            }
            else {
                video.pause();
                playIndicatorObj.visible = false;
                pauseIndicatorObj.visible = true;
                rightMenuIndicatorCoroutine = (0, coroutine_1.coroutine)(animateIndicator(world, bit_components_1.VideoMenu.pauseIndicatorRef[eid]));
            }
        }
        var videoIsFacingCamera = (0, three_utils_1.isFacingCamera)(world.eid2obj.get(videoEid));
        var yRot = videoIsFacingCamera ? 0 : Math.PI;
        if (menuObj.rotation.y !== yRot) {
            menuObj.rotation.y = yRot;
            menuObj.matrixNeedsUpdate = true;
        }
        var headObj = world.eid2obj.get(bit_components_1.VideoMenu.headRef[eid]);
        if ((0, bitecs_1.hasComponent)(world, bit_components_1.HeldRemoteRight, bit_components_1.VideoMenu.trackRef[eid])) {
            var trackObj = world.eid2obj.get(bit_components_1.VideoMenu.trackRef[eid]);
            intersectInThePlaneOf(trackObj, userinput.get(paths_1.paths.actions.cursor.right.pose), intersectionPoint);
            if (intersectionPoint) {
                var newPosition = headObj.parent.worldToLocal(intersectionPoint);
                video.currentTime =
                    (0, MathUtils_1.mapLinear)((0, MathUtils_1.clamp)(newPosition.x, -sliderHalfWidth, sliderHalfWidth), -sliderHalfWidth, sliderHalfWidth, 0, 1) *
                        video.duration;
            }
            if ((0, bitecs_1.hasComponent)(world, bit_components_1.NetworkedVideo, videoEid)) {
                (0, netcode_1.takeOwnership)(world, videoEid);
            }
        }
        headObj.position.x = (0, MathUtils_1.mapLinear)(video.currentTime, 0, video.duration, -sliderHalfWidth, sliderHalfWidth);
        headObj.matrixNeedsUpdate = true;
        var timeLabelRef = world.eid2obj.get(bit_components_1.VideoMenu.timeLabelRef[eid]);
        timeLabelRef.text = "".concat((0, media_video_1.timeFmt)(video.currentTime), " / ").concat((0, media_video_1.timeFmt)(video.duration));
        timeLabelRef.sync();
        if (rightMenuIndicatorCoroutine && rightMenuIndicatorCoroutine().done) {
            rightMenuIndicatorCoroutine = null;
        }
    });
}
exports.videoMenuSystem = videoMenuSystem;
var START_SCALE = new three_1.Vector3().setScalar(0.05);
var END_SCALE = new three_1.Vector3().setScalar(0.25);
function animateIndicator(world, eid) {
    var obj;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                obj = world.eid2obj.get(eid);
                return [5 /*yield**/, __values((0, animate_1.animate)({
                        properties: [
                            [START_SCALE, END_SCALE],
                            [0.75, 0]
                        ],
                        durationMS: 700,
                        easing: easing_1.easeOutQuadratic,
                        fn: function (_a) {
                            var scale = _a[0], opacity = _a[1];
                            obj.scale.copy(scale);
                            obj.matrixNeedsUpdate = true;
                            obj.material.opacity = opacity;
                        }
                    }))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
