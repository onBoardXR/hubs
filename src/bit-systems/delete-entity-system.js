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
exports.deleteEntitySystem = void 0;
var bitecs_1 = require("bitecs");
var three_1 = require("three");
var bit_components_1 = require("../bit-components");
var paths_1 = require("../systems/userinput/paths");
var animate_1 = require("../utils/animate");
var bit_utils_1 = require("../utils/bit-utils");
var coroutine_1 = require("../utils/coroutine");
var easing_1 = require("../utils/easing");
var END_SCALE = new three_1.Vector3().setScalar(0.001);
function animateThenRemoveEntity(world, eid) {
    var obj;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                obj = world.eid2obj.get(eid);
                return [5 /*yield**/, __values((0, animate_1.animate)({
                        properties: [[obj.scale.clone(), END_SCALE]],
                        durationMS: 400,
                        easing: easing_1.easeOutQuadratic,
                        fn: function (_a) {
                            var scale = _a[0];
                            obj.scale.copy(scale);
                            obj.matrixNeedsUpdate = true;
                        }
                    }))];
            case 1:
                _a.sent();
                (0, bitecs_1.removeEntity)(world, eid);
                return [2 /*return*/];
        }
    });
}
var deletableQuery = (0, bitecs_1.defineQuery)([bit_components_1.Deletable]);
var deletableExitQuery = (0, bitecs_1.exitQuery)(deletableQuery);
var hoveredRightQuery = (0, bitecs_1.defineQuery)([bit_components_1.HoveredRemoteRight]);
var hoveredLeftQuery = (0, bitecs_1.defineQuery)([bit_components_1.HoveredRemoteLeft]);
var coroutines = new Map();
function deleteTheDeletableAncestor(world, eid) {
    var ancestor = (0, bit_utils_1.findAncestorEntity)(world, eid, function (e) { return (0, bitecs_1.hasComponent)(world, bit_components_1.Deletable, e); });
    if (ancestor && !coroutines.has(ancestor)) {
        coroutines.set(ancestor, (0, coroutine_1.coroutine)(animateThenRemoveEntity(world, ancestor)));
    }
}
function deleteEntitySystem(world, userinput) {
    deletableExitQuery(world).forEach(function (eid) {
        coroutines["delete"](eid);
    });
    if (userinput.get(paths_1.paths.actions.cursor.right.deleteEntity)) {
        hoveredRightQuery(world).forEach(function (eid) { return deleteTheDeletableAncestor(world, eid); });
    }
    if (userinput.get(paths_1.paths.actions.cursor.left.deleteEntity)) {
        hoveredLeftQuery(world).forEach(function (eid) { return deleteTheDeletableAncestor(world, eid); });
    }
    coroutines.forEach(function (c) { return c(); });
}
exports.deleteEntitySystem = deleteEntitySystem;
