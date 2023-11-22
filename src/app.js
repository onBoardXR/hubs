"use strict";
exports.__esModule = true;
exports.App = void 0;
var bitecs = require("bitecs");
var bitecs_1 = require("bitecs");
require("./aframe-to-bit-components");
var bit_components_1 = require("./bit-components");
var media_search_store_1 = require("./storage/media-search-store");
var store_1 = require("./storage/store");
var qs_truthy_1 = require("./utils/qs_truthy");
var three_1 = require("three");
var naf_dialog_adapter_1 = require("./naf-dialog-adapter");
var preload_1 = require("./utils/preload");
window.$B = bitecs;
var timeSystem = function (world) {
    var time = world.time;
    var now = performance.now();
    var delta = now - time.then;
    time.delta = delta;
    time.elapsed += delta;
    time.then = now;
    time.tick++;
    return world;
};
var App = /** @class */ (function () {
    function App() {
        var _this = this;
        this.store = new store_1["default"]();
        this.mediaSearchStore = new media_search_store_1["default"]();
        this.audios = new Map();
        this.sourceType = new Map();
        this.audioOverrides = new Map();
        this.zoneOverrides = new Map();
        this.gainMultipliers = new Map();
        this.supplementaryAttenuation = new Map();
        this.clippingState = new Set();
        this.mutedState = new Set();
        this.isAudioPaused = new Set();
        this.audioDebugPanelOverrides = new Map();
        this.sceneAudioDefaults = new Map();
        this.world = (0, bitecs_1.createWorld)();
        this.nextSid = 1;
        this.dialog = new naf_dialog_adapter_1.DialogAdapter();
        this.RENDER_ORDER = {
            HUD_BACKGROUND: 1,
            HUD_ICONS: 2,
            CURSOR: 3
        };
        // TODO: Create accessor / update methods for these maps / set
        this.world.eid2obj = new Map();
        this.world.nid2eid = new Map();
        this.world.deletedNids = new Set();
        this.world.ignoredNids = new Set();
        // used in aframe and networked aframe to avoid imports
        this.world.nameToComponent = {
            object3d: bit_components_1.Object3DTag,
            networked: bit_components_1.Networked,
            owned: bit_components_1.Owned,
            AEntity: bit_components_1.AEntity
        };
        // reserve entity 0 to avoid needing to check for undefined everywhere eid is checked for existance
        (0, bitecs_1.addEntity)(this.world);
        this.str2sid = new Map([[null, 0]]);
        this.sid2str = new Map([[0, null]]);
        window.$O = function (eid) { return _this.world.eid2obj.get(eid); };
    }
    // TODO nothing ever cleans these up
    App.prototype.getSid = function (str) {
        if (!this.str2sid.has(str)) {
            var sid = this.nextSid;
            this.nextSid = this.nextSid + 1;
            this.str2sid.set(str, sid);
            this.sid2str.set(sid, str);
            return sid;
        }
        return this.str2sid.get(str);
    };
    App.prototype.getString = function (sid) {
        return this.sid2str.get(sid);
    };
    // This gets called by a-scene to setup the renderer, camera, and audio listener
    // TODO ideally the contorl flow here would be inverted, and we would setup this stuff,
    // initialize aframe, and then run our own RAF loop
    App.prototype.setupRenderer = function (sceneEl) {
        var _this = this;
        var canvas = document.createElement("canvas");
        canvas.classList.add("a-canvas");
        canvas.dataset.aframeCanvas = "true";
        // TODO this comes from aframe and prevents zoom on ipad.
        // This should alreeady be handleed by disable-ios-zoom but it does not appear to work
        canvas.addEventListener("touchmove", function (event) {
            event.preventDefault();
        });
        var renderer = new three_1.WebGLRenderer({
            // TODO we should not be using alpha: false https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#avoid_alphafalse_which_can_be_expensive
            alpha: true,
            antialias: true,
            depth: true,
            stencil: true,
            premultipliedAlpha: true,
            preserveDrawingBuffer: false,
            logarithmicDepthBuffer: false,
            // TODO we probably want high-performance
            powerPreference: "high-performance",
            canvas: canvas
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.debug.checkShaderErrors = (0, qs_truthy_1["default"])("checkShaderErrors");
        // These get overridden by environment-system but setting to the highly expected defaults to avoid any extra work
        renderer.physicallyCorrectLights = true;
        renderer.outputEncoding = three_1.sRGBEncoding;
        sceneEl.appendChild(renderer.domElement);
        var camera = new three_1.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.05, 10000);
        var audioListener = new three_1.AudioListener();
        this.audioListener = audioListener;
        camera.add(audioListener);
        var renderClock = new three_1.Clock();
        // TODO NAF currently depends on this, it should not
        sceneEl.clock = renderClock;
        // TODO we should have 1 source of truth for time
        this.world.time = {
            delta: 0,
            elapsed: 0,
            then: performance.now(),
            tick: 0
        };
        this.world.scene = sceneEl.object3D;
        // Main RAF loop
        var mainTick = function (_rafTime, xrFrame) {
            // TODO we should probably be using time from the raf loop itself
            var delta = renderClock.getDelta() * 1000;
            var time = renderClock.elapsedTime * 1000;
            // TODO pass this into systems that care about it (like input) once they are moved into this loop
            sceneEl.frame = xrFrame;
            timeSystem(_this.world);
            // Tick AFrame systems and components
            if (sceneEl.isPlaying) {
                sceneEl.tick(time, delta);
            }
            //onboardxr
            if (window.sockSys && window.sockSys.theatreJS && window.sockSys.theatreJS.rafDriver) {
                window.sockSys.theatreJS.rafDriver.tick(performance.now());
                //console.log('ticking')
            }
            //onboardxrend
            renderer.render(sceneEl.object3D, camera);
        };
        // This gets called after all system and component init functions
        sceneEl.addEventListener("loaded", function () {
            (0, preload_1.waitForPreloads)().then(function () {
                renderer.setAnimationLoop(mainTick);
                sceneEl.renderStarted = true;
            });
        });
        return {
            renderer: renderer,
            camera: camera,
            audioListener: audioListener
        };
    };
    return App;
}());
exports.App = App;
