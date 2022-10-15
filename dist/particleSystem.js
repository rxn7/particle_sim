import { camera, gl, shaders } from './global.js';
import { COLOR_SIZE_BYTES } from './math/color.js';
import { VECTOR2_SIZE_BYTES } from './math/vector2.js';
import { FLOAT_SIZE_BYTES } from './helpers/sizes.js';
const PARTICLE_FLOAT_COUNT = 2 + 2 + 3 + 1;
const PARTICLE_SIZE_BYTES = PARTICLE_FLOAT_COUNT * FLOAT_SIZE_BYTES;
export class ParticleSystem {
    constructor(particleCount, origin = { x: 0, y: 0 }) {
        this.vaos = [];
        this.tfos = [];
        this.tfBuffersa = [];
        this.currentVaoIdx = 0;
        this.mouseClicked = true;
        this.particleCount = particleCount;
        this.origin = origin;
        this.vaos = [gl.createVertexArray(), gl.createVertexArray()];
        this.tfos = [gl.createTransformFeedback(), gl.createTransformFeedback()];
        window.addEventListener('mousedown', ev => {
            this.handleMouseClick({ x: ev.clientX, y: ev.clientY });
        });
        this.initBuffers();
    }
    initBuffers() {
        this.tfBuffersa = [];
        for (let i = 0; i < 2; ++i) {
            gl.bindVertexArray(this.vaos[i]);
            shaders.particleShaderProgram.bind();
            this.tfBuffersa[i] = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.tfBuffersa[i]);
            gl.bufferData(gl.ARRAY_BUFFER, this.particleCount * PARTICLE_SIZE_BYTES, gl.DYNAMIC_COPY);
            this.setVertexAttribPointers();
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.tfos[i]);
            gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.tfBuffersa[i]);
            gl.bindVertexArray(null);
        }
        this.currentVaoIdx = 0;
    }
    handleMouseClick(position) {
        this.origin = camera.screenToWorld(position);
        this.mouseClicked = true;
    }
    setVertexAttribPointers() {
        let offset = 0;
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, PARTICLE_SIZE_BYTES, 0);
        gl.enableVertexAttribArray(0);
        offset += VECTOR2_SIZE_BYTES;
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, PARTICLE_SIZE_BYTES, offset);
        gl.enableVertexAttribArray(1);
        offset += VECTOR2_SIZE_BYTES;
        gl.vertexAttribPointer(2, 3, gl.FLOAT, false, PARTICLE_SIZE_BYTES, offset);
        gl.enableVertexAttribArray(2);
        offset += COLOR_SIZE_BYTES;
        gl.vertexAttribPointer(3, 1, gl.FLOAT, false, PARTICLE_SIZE_BYTES, offset);
        gl.enableVertexAttribArray(3);
        offset += FLOAT_SIZE_BYTES;
    }
    draw() {
        const idx = (this.currentVaoIdx + 1) % 2;
        const vaoSource = this.vaos[this.currentVaoIdx];
        const transformFeedback = this.tfos[idx];
        gl.uniform1i(shaders.particleShaderProgram.uniforms.randomize, +this.mouseClicked);
        gl.uniform2f(shaders.particleShaderProgram.uniforms.origin, this.origin.x, this.origin.y);
        gl.bindVertexArray(vaoSource);
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback);
        gl.beginTransformFeedback(gl.POINTS);
        gl.drawArrays(gl.POINTS, 0, this.particleCount);
        gl.endTransformFeedback();
        this.currentVaoIdx = idx;
        this.mouseClicked = false;
    }
}
