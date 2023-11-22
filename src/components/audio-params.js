"use strict";
// TODO: Reintroduce audio normalization
// import { AudioNormalizer } from "../utils/audio-normalizer";
exports.__esModule = true;
exports.GAIN_TIME_CONST = exports.TargetAudioDefaults = exports.MediaAudioDefaults = exports.AvatarAudioDefaults = exports.PanningModelType = exports.DistanceModelType = exports.AudioType = exports.SourceType = exports.DISTANCE_MODEL_OPTIONS = void 0;
exports.DISTANCE_MODEL_OPTIONS = ["linear", "inverse", "exponential"];
var SourceType;
(function (SourceType) {
    SourceType[SourceType["MEDIA_VIDEO"] = 0] = "MEDIA_VIDEO";
    SourceType[SourceType["AVATAR_AUDIO_SOURCE"] = 1] = "AVATAR_AUDIO_SOURCE";
    SourceType[SourceType["SFX"] = 2] = "SFX";
    SourceType[SourceType["AUDIO_TARGET"] = 3] = "AUDIO_TARGET";
    SourceType[SourceType["AUDIO_ZONE"] = 4] = "AUDIO_ZONE";
})(SourceType = exports.SourceType || (exports.SourceType = {}));
var AudioType;
(function (AudioType) {
    AudioType["Stereo"] = "stereo";
    AudioType["PannerNode"] = "pannernode";
})(AudioType = exports.AudioType || (exports.AudioType = {}));
var DistanceModelType;
(function (DistanceModelType) {
    DistanceModelType["Linear"] = "linear";
    DistanceModelType["Inverse"] = "inverse";
    DistanceModelType["Exponential"] = "exponential";
})(DistanceModelType = exports.DistanceModelType || (exports.DistanceModelType = {}));
var PanningModelType;
(function (PanningModelType) {
    PanningModelType["HRTF"] = "HRTF";
    PanningModelType["EqualPower"] = "equalpower";
})(PanningModelType = exports.PanningModelType || (exports.PanningModelType = {}));
exports.AvatarAudioDefaults = {
    audioType: AudioType.PannerNode,
    distanceModel: DistanceModelType.Inverse,
    panningModel: PanningModelType.HRTF,
    rolloffFactor: 5,
    refDistance: 5,
    maxDistance: 10000,
    coneInnerAngle: 180,
    coneOuterAngle: 360,
    coneOuterGain: 0.9,
    gain: 1.0
};
exports.MediaAudioDefaults = {
    audioType: AudioType.PannerNode,
    distanceModel: DistanceModelType.Inverse,
    panningModel: PanningModelType.HRTF,
    rolloffFactor: 5,
    refDistance: 5,
    maxDistance: 10000,
    coneInnerAngle: 360,
    coneOuterAngle: 0,
    coneOuterGain: 0.9,
    gain: 0.5
};
exports.TargetAudioDefaults = {
    audioType: AudioType.PannerNode,
    distanceModel: DistanceModelType.Inverse,
    panningModel: PanningModelType.HRTF,
    rolloffFactor: 5,
    refDistance: 8,
    maxDistance: 10000,
    coneInnerAngle: 170,
    coneOuterAngle: 300,
    coneOuterGain: 0.3,
    gain: 1.0
};
exports.GAIN_TIME_CONST = 0.2;
