"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
exports.__esModule = true;
var netcode_js_1 = require("./systems/netcode.js");
var media_utils_1 = require("./utils/media-utils");
var media_url_utils_1 = require("./utils/media-url-utils");
var three_1 = require("three");
var qs_truthy_1 = require("./utils/qs_truthy");
function spawnFromUrl(text) {
    if (!text) {
        return;
    }
    if (!(0, media_utils_1.parseURL)(text)) {
        console.warn("Could not parse URL. Ignoring pasted text:\n".concat(text));
        return;
    }
    var eid = (0, netcode_js_1.createNetworkedEntity)(APP.world, "media", { src: text, recenter: true, resize: true });
    var avatarPov = document.querySelector("#avatar-pov-node").object3D;
    var obj = APP.world.eid2obj.get(eid);
    obj.position.copy(avatarPov.localToWorld(new three_1.Vector3(0, 0, -1.5)));
    obj.lookAt(avatarPov.getWorldPosition(new three_1.Vector3()));
}
function spawnFromFileList(files) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, files_1, file, desiredContentType, params, eid, avatarPov, obj;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _i = 0, files_1 = files;
                    _a.label = 1;
                case 1:
                    if (!(_i < files_1.length)) return [3 /*break*/, 4];
                    file = files_1[_i];
                    desiredContentType = file.type || (0, media_url_utils_1.guessContentType)(file.name);
                    return [4 /*yield*/, (0, media_utils_1.upload)(file, desiredContentType)
                            .then(function (response) {
                            var srcUrl = new URL(response.origin);
                            srcUrl.searchParams.set("token", response.meta.access_token);
                            window.APP.store.update({
                                uploadPromotionTokens: [{ fileId: response.file_id, promotionToken: response.meta.promotion_token }]
                            });
                            return {
                                src: srcUrl.href,
                                recenter: true,
                                resize: true
                            };
                        })["catch"](function (e) {
                            console.error("Media upload failed", e);
                            return {
                                src: "error",
                                recenter: true,
                                resize: true
                            };
                        })];
                case 2:
                    params = _a.sent();
                    eid = (0, netcode_js_1.createNetworkedEntity)(APP.world, "media", params);
                    avatarPov = document.querySelector("#avatar-pov-node").object3D;
                    obj = APP.world.eid2obj.get(eid);
                    obj.position.copy(avatarPov.localToWorld(new three_1.Vector3(0, 0, -1.5)));
                    obj.lookAt(avatarPov.getWorldPosition(new three_1.Vector3()));
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function onPaste(e) {
    return __awaiter(this, void 0, void 0, function () {
        var isPastedInChat, text;
        return __generator(this, function (_a) {
            if (!AFRAME.scenes[0].is("entered")) {
                return [2 /*return*/];
            }
            isPastedInChat = (e.target.matches("input, textarea") || e.target.contentEditable === "true") &&
                document.activeElement === e.target;
            if (isPastedInChat) {
                return [2 /*return*/];
            }
            if (!e.clipboardData) {
                return [2 /*return*/];
            }
            e.preventDefault();
            if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length) {
                return [2 /*return*/, spawnFromFileList(e.clipboardData.files)];
            }
            text = e.clipboardData.getData("text");
            spawnFromUrl(text);
            return [2 /*return*/];
        });
    });
}
function onDrop(e) {
    var _a, _b, _c;
    if (!AFRAME.scenes[0].is("entered")) {
        return;
    }
    var files = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.files;
    if (files && files.length) {
        e.preventDefault();
        return spawnFromFileList(files);
    }
    var url = ((_b = e.dataTransfer) === null || _b === void 0 ? void 0 : _b.getData("url")) || ((_c = e.dataTransfer) === null || _c === void 0 ? void 0 : _c.getData("text"));
    if (url) {
        e.preventDefault();
        return spawnFromUrl(url);
    }
}
if ((0, qs_truthy_1["default"])("newLoader")) {
    document.addEventListener("paste", onPaste);
    document.addEventListener("drop", onDrop);
}
