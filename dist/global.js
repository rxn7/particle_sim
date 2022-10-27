import { Camera } from './camera.js';
import { Logger } from './logger.js';
export var Global;
(function (Global) {
    function init() {
        Global.camera = new Camera();
        Logger.LogInit('Global');
    }
    Global.init = init;
})(Global || (Global = {}));
