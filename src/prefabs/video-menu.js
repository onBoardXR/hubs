"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.VideoMenuPrefab = void 0;
/** @jsx createElementEntity */
var three_1 = require("three");
var camera_tool_1 = require("../prefabs/camera-tool");
var create_image_mesh_1 = require("../utils/create-image-mesh");
var jsx_entity_1 = require("../utils/jsx-entity");
var media_utils_1 = require("../utils/media-utils");
var play_png_1 = require("../assets/images/sprites/notice/play.png");
var pause_png_1 = require("../assets/images/sprites/notice/pause.png");
var playTexture = media_utils_1.textureLoader.load(play_png_1["default"]);
var pauseTexture = media_utils_1.textureLoader.load(pause_png_1["default"]);
function Slider(_a) {
    var trackRef = _a.trackRef, headRef = _a.headRef, props = __rest(_a, ["trackRef", "headRef"]);
    return (<entity {...props} name="Slider">
      <entity name="Slider:Track" videoMenuItem object3D={new three_1.Mesh(new three_1.PlaneBufferGeometry(1.0, 0.05), new three_1.MeshBasicMaterial({ opacity: 0.5, color: 0x000000, transparent: true }))} cursorRaycastable remoteHoverTarget holdable holdableButton ref={trackRef}>
        <entity name="Slider:Head" object3D={new three_1.Mesh(new three_1.BoxBufferGeometry(0.05, 0.05, 0.05), new three_1.MeshBasicMaterial())} ref={headRef}/>
      </entity>
    </entity>);
}
function VideoMenuPrefab() {
    var uiZ = 0.001;
    var timeLabelRef = (0, jsx_entity_1.createRef)();
    var headRef = (0, jsx_entity_1.createRef)();
    var trackRef = (0, jsx_entity_1.createRef)();
    var playIndicatorRef = (0, jsx_entity_1.createRef)();
    var pauseIndicatorRef = (0, jsx_entity_1.createRef)();
    var halfHeight = 9 / 16 / 2;
    return (<entity name="Video Menu" videoMenu={{ timeLabelRef: timeLabelRef, headRef: headRef, trackRef: trackRef, playIndicatorRef: playIndicatorRef, pauseIndicatorRef: pauseIndicatorRef }}>
      <camera_tool_1.Label name="Time Label" text={{ anchorY: "top", anchorX: "right" }} ref={timeLabelRef} scale={[0.5, 0.5, 0.5]} position={[0.5 - 0.02, halfHeight - 0.02, uiZ]}/>
      <Slider trackRef={trackRef} headRef={headRef} position={[0, -halfHeight + 0.025, uiZ]}/>
      <entity ref={playIndicatorRef} position={[0, 0, uiZ]} scale={[0.25, 0.25, 0.25]} image={{
            texture: playTexture,
            ratio: 1,
            projection: "flat",
            alphaMode: create_image_mesh_1.AlphaMode.Blend
        }} textureCacheKey={{
            src: play_png_1["default"],
            version: 1
        }} visible={false}/>
      <entity ref={pauseIndicatorRef} position={[0, 0, uiZ]} scale={[0.25, 0.25, 0.25]} image={{
            texture: pauseTexture,
            ratio: 1,
            projection: "flat",
            alphaMode: create_image_mesh_1.AlphaMode.Blend
        }} textureCacheKey={{
            src: pause_png_1["default"],
            version: 1
        }} visible={false}/>
    </entity>);
}
exports.VideoMenuPrefab = VideoMenuPrefab;
