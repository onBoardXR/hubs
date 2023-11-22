"use strict";
exports.__esModule = true;
exports.videoSystem = void 0;
var bitecs_1 = require("bitecs");
var three_1 = require("three");
var bit_components_1 = require("../bit-components");
var audio_params_1 = require("../components/audio-params");
var update_audio_settings_1 = require("../update-audio-settings");
var jsx_entity_1 = require("../utils/jsx-entity");
var Flags;
(function (Flags) {
    Flags[Flags["PAUSED"] = 1] = "PAUSED";
})(Flags || (Flags = {}));
function makeAudioSourceEntity(world, video, audioSystem) {
    var eid = (0, bitecs_1.addEntity)(world);
    APP.sourceType.set(eid, audio_params_1.SourceType.MEDIA_VIDEO);
    if (video.paused) {
        APP.isAudioPaused.add(eid);
    }
    else {
        APP.isAudioPaused["delete"](eid);
    }
    var audio;
    var audioType = (0, update_audio_settings_1.getCurrentAudioSettings)(eid).audioType;
    var audioListener = APP.audioListener;
    if (audioType === audio_params_1.AudioType.PannerNode) {
        audio = new three_1.PositionalAudio(audioListener);
    }
    else {
        audio = new three_1.Audio(audioListener);
    }
    (0, bitecs_1.addComponent)(world, bit_components_1.AudioEmitter, eid);
    (0, jsx_entity_1.addObject3DComponent)(world, eid, audio);
    audio.gain.gain.value = 0;
    audioSystem.addAudio({ sourceType: audio_params_1.SourceType.MEDIA_VIDEO, node: audio });
    var audioSrcEl = video;
    audio.setMediaElementSource(audioSrcEl);
    APP.audios.set(eid, audio);
    (0, update_audio_settings_1.updateAudioSettings)(eid, audio);
    // Original audio source volume can now be restored as audio systems will take over
    audioSrcEl.volume = 1;
    return eid;
}
function isPositionalAudio(node) {
    return node.panner !== undefined;
}
function swapAudioType(world, audioSystem, eid, NewType) {
    var audio = world.eid2obj.get(eid);
    audio.disconnect();
    audioSystem.removeAudio({ node: audio });
    var newAudio = new NewType(APP.audioListener);
    newAudio.setNodeSource(audio.source);
    audioSystem.addAudio({ sourceType: audio_params_1.SourceType.MEDIA_VIDEO, node: newAudio });
    APP.audios.set(eid, newAudio);
    audio.parent.add(newAudio);
    newAudio.matrixWorldNeedsUpdate = true; // TODO: Fix in threejs
    audio.removeFromParent();
    (0, jsx_entity_1.swapObject3DComponent)(world, eid, newAudio);
}
// TODO this can live outside of video system
var staleAudioEmittersQuery = (0, bitecs_1.defineQuery)([bit_components_1.AudioEmitter, bit_components_1.AudioSettingsChanged]);
function audioEmitterSystem(world, audioSystem) {
    staleAudioEmittersQuery(world).forEach(function (eid) {
        var audio = world.eid2obj.get(eid);
        var settings = (0, update_audio_settings_1.getCurrentAudioSettings)(eid);
        var isPannerNode = isPositionalAudio(audio);
        // TODO this needs more testing
        if (!isPannerNode && settings.audioType === audio_params_1.AudioType.PannerNode) {
            swapAudioType(world, audioSystem, eid, three_1.PositionalAudio);
        }
        else if (isPannerNode && settings.audioType === audio_params_1.AudioType.Stereo) {
            swapAudioType(world, audioSystem, eid, three_1.Audio);
        }
        (0, update_audio_settings_1.applySettings)(audio, settings);
        (0, bitecs_1.removeComponent)(world, bit_components_1.AudioSettingsChanged, eid);
    });
}
var OUT_OF_SYNC_SEC = 5;
var networkedVideoQuery = (0, bitecs_1.defineQuery)([bit_components_1.NetworkedVideo]);
var mediaVideoQuery = (0, bitecs_1.defineQuery)([bit_components_1.MediaVideo]);
var mediaVideoEnterQuery = (0, bitecs_1.enterQuery)(mediaVideoQuery);
function videoSystem(world, audioSystem) {
    mediaVideoEnterQuery(world).forEach(function (eid) {
        var videoObj = world.eid2obj.get(eid);
        var video = videoObj.material.map.image;
        if (bit_components_1.MediaVideo.autoPlay[eid]) {
            video.play()["catch"](function () {
                // Need to deal with the fact play() may fail if user has not interacted with browser yet.
                console.error("Error auto-playing video.");
            });
        }
        var audio = world.eid2obj.get(makeAudioSourceEntity(world, video, audioSystem));
        videoObj.add(audio);
        audio.matrixWorldNeedsUpdate = true; // TODO: Fix in threejs
        // Note in media-video we call updateMatrixWorld here to force PositionalAudio's updateMatrixWorld to run even
        // if it has an invisible parent. We don't want to have invisible parents now.
    });
    audioEmitterSystem(world, audioSystem);
    networkedVideoQuery(world).forEach(function (eid) {
        var video = world.eid2obj.get(eid).material.map.image;
        if ((0, bitecs_1.hasComponent)(world, bit_components_1.Owned, eid)) {
            bit_components_1.NetworkedVideo.time[eid] = video.currentTime;
            var flags = 0;
            flags |= video.paused ? Flags.PAUSED : 0;
            bit_components_1.NetworkedVideo.flags[eid] = flags;
        }
        else {
            var networkedPauseState = !!(bit_components_1.NetworkedVideo.flags[eid] & Flags.PAUSED);
            if (networkedPauseState !== video.paused) {
                video.paused ? video.play() : video.pause();
            }
            if (networkedPauseState || Math.abs(bit_components_1.NetworkedVideo.time[eid] - video.currentTime) > OUT_OF_SYNC_SEC) {
                video.currentTime = bit_components_1.NetworkedVideo.time[eid];
            }
        }
    });
}
exports.videoSystem = videoSystem;
