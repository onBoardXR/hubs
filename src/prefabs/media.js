"use strict";
exports.__esModule = true;
exports.MediaPrefab = void 0;
/** @jsx createElementEntity */
var jsx_entity_1 = require("../utils/jsx-entity");
var constants_1 = require("../constants");
var floaty_object_system_1 = require("../systems/floaty-object-system");
function MediaPrefab(params) {
    return (<entity name="Interactable Media" networked networkedTransform mediaLoader={params} deletable grabbable destroyAtExtremeDistance floatyObject={{
            flags: floaty_object_system_1.FLOATY_OBJECT_FLAGS.MODIFY_GRAVITY_ON_RELEASE,
            releaseGravity: 0
        }} rigidbody={{ collisionGroup: constants_1.COLLISION_LAYERS.INTERACTABLES, collisionMask: constants_1.COLLISION_LAYERS.HANDS }} physicsShape={{ halfExtents: [0.22, 0.14, 0.1] }} /* TODO Physics shapes*/ scale={[1, 1, 1]}/>);
}
exports.MediaPrefab = MediaPrefab;
