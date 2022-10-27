import { WebGL2NotSupportedError } from './errors/webGL2Error.js';
import { Logger } from './logger.js';
import { Resources } from './resources.js';
export var Graphics;
(function (Graphics) {
    Graphics.canvas = document.getElementById('canvas');
    Graphics.ctx = Graphics.canvas.getContext('webgl2');
    function init() {
        if (!Graphics.ctx)
            throw new WebGL2NotSupportedError();
        initGl();
        Logger.LogInit('Graphics');
    }
    Graphics.init = init;
    function clear() {
        Graphics.ctx.clearColor(0.0, 0.0, 0, 1.0);
        Graphics.ctx.clear(Graphics.ctx.COLOR_BUFFER_BIT);
    }
    Graphics.clear = clear;
    function draw(particleSystem) {
        particleSystem.draw();
        Graphics.ctx.uniform1i(Resources.shaders.particleShaderProgram?.uniforms.init, 0);
    }
    Graphics.draw = draw;
    function initGl() {
        Graphics.ctx.enable(Graphics.ctx.BLEND);
        Graphics.ctx.blendFunc(Graphics.ctx.SRC_ALPHA, Graphics.ctx.ONE_MINUS_SRC_ALPHA);
    }
})(Graphics || (Graphics = {}));
