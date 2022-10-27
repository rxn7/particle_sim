import { camera, canvas, gl, shaders } from './global.js';
import { WebGL2NotSupportedError } from './errors/webGL2Error.js';
import { ParticleSystem } from './particleSystem.js';
import { Debug } from './debug.js';
const PARTICLE_COUNT = 10000;
const particleSystem = new ParticleSystem(PARTICLE_COUNT);
let oldTimeStamp = 0;
function init() {
    if (!gl)
        throw new WebGL2NotSupportedError();
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform1i(shaders.particleShaderProgram.uniforms.init, 1);
    updateSize();
    requestAnimationFrame(animationFrame);
}
function animationFrame(timeStamp) {
    requestAnimationFrame(animationFrame);
    update(timeStamp);
    draw();
}
function update(timeStamp) {
    const timeDelta = oldTimeStamp == 0 ? 0 : (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    Debug.update({ timeDelta: timeDelta, particleCount: PARTICLE_COUNT });
    gl.uniform1i(shaders.particleShaderProgram.uniforms.time, timeStamp * 1000);
    gl.uniform1f(shaders.particleShaderProgram.uniforms.timeDelta, timeDelta);
    gl.uniformMatrix4fv(shaders.particleShaderProgram.uniforms.projectionMatrix, false, camera.getProjectionMatrixValues());
}
function draw() {
    gl.clearColor(0.0, 0.0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    particleSystem.draw();
    gl.uniform1i(shaders.particleShaderProgram.uniforms.init, 0);
}
function updateSize() {
    var _a, _b;
    const width = Math.trunc(((_a = window.visualViewport) === null || _a === void 0 ? void 0 : _a.width) || window.innerWidth);
    const height = Math.trunc(((_b = window.visualViewport) === null || _b === void 0 ? void 0 : _b.height) || window.innerHeight);
    if (width === 0 || height === 0)
        return;
    console.log(`Resizing: ${width}x${height}`);
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    camera.recalculate();
}
document.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', updateSize);
