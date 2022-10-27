import { Logger } from './logger.js';
import { ParticleShaderProgram } from './resources/shaders/particleShaderProgram.js';
export var Resources;
(function (Resources) {
    Resources.shaders = {};
    function init() {
        Resources.shaders.particleShaderProgram = new ParticleShaderProgram();
        Logger.LogInit('Resources');
    }
    Resources.init = init;
})(Resources || (Resources = {}));
