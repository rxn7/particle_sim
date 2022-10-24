import { camera, gl, shaders } from './global.js';
import { COLOR_SIZE_BYTES } from './math/color.js';
import { VECTOR2_SIZE_BYTES } from './math/vector2.js';
import { FLOAT_SIZE_BYTES } from './helpers/sizes.js';
export const PARTICLE_SIZE_BYTES = VECTOR2_SIZE_BYTES + VECTOR2_SIZE_BYTES + COLOR_SIZE_BYTES + FLOAT_SIZE_BYTES + FLOAT_SIZE_BYTES + FLOAT_SIZE_BYTES;
export class ParticleSystem {
    constructor(particleCount) {
        this.vaos = [];
        this.tfos = [];
        this.tfBuffersa = [];
        this.currentVaoIdx = 0;
        this.particleCount = particleCount;
        this.vaos = [gl.createVertexArray(), gl.createVertexArray()];
        this.tfos = [gl.createTransformFeedback(), gl.createTransformFeedback()];
        window.addEventListener('mousemove', ev => {
            this.handleMouseMove({ x: ev.clientX, y: ev.clientY });
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
    handleMouseMove(position) {
        const origin = camera.screenToWorld(position);
        gl.uniform2f(shaders.particleShaderProgram.uniforms.origin, origin.x, origin.y);
    }
    setVertexAttribPointers() {
        let offset = 0;
        let idx = 0;
        gl.vertexAttribPointer(idx, 2, gl.FLOAT, false, PARTICLE_SIZE_BYTES, 0);
        gl.enableVertexAttribArray(idx++);
        offset += VECTOR2_SIZE_BYTES;
        gl.vertexAttribPointer(idx, 2, gl.FLOAT, false, PARTICLE_SIZE_BYTES, offset);
        gl.enableVertexAttribArray(idx++);
        offset += VECTOR2_SIZE_BYTES;
        gl.vertexAttribPointer(idx, 3, gl.FLOAT, false, PARTICLE_SIZE_BYTES, offset);
        gl.enableVertexAttribArray(idx++);
        offset += COLOR_SIZE_BYTES;
        gl.vertexAttribPointer(idx, 1, gl.FLOAT, false, PARTICLE_SIZE_BYTES, offset);
        gl.enableVertexAttribArray(idx++);
        offset += FLOAT_SIZE_BYTES;
        gl.vertexAttribPointer(idx, 1, gl.FLOAT, false, PARTICLE_SIZE_BYTES, offset);
        gl.enableVertexAttribArray(idx++);
        offset += FLOAT_SIZE_BYTES;
        gl.vertexAttribPointer(idx, 1, gl.FLOAT, false, PARTICLE_SIZE_BYTES, offset);
        gl.enableVertexAttribArray(idx++);
        offset += FLOAT_SIZE_BYTES;
    }
    draw() {
        const idx = (this.currentVaoIdx + 1) % 2;
        const vaoSource = this.vaos[this.currentVaoIdx];
        const transformFeedback = this.tfos[idx];
        gl.bindVertexArray(vaoSource);
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback);
        gl.beginTransformFeedback(gl.POINTS);
        gl.drawArrays(gl.POINTS, 0, this.particleCount);
        gl.endTransformFeedback();
        this.currentVaoIdx = idx;
    }
}
