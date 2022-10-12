import { gl } from './global.js';
import { particleShaderTimeDeltaUniformLocation, particleShaderProgram } from './resources/shaders/particleShader.js';
import { COLOR_SIZE_BYTES } from './types/color.js';
import { PARTICLE_SIZE_BYTES } from './types/particle.js';
import { VECTOR2_SIZE_BYTES } from './types/vector2.js';
export class ParticleSystem {
    constructor(particleCount, position) {
        this.vaos = [];
        this.tfos = [];
        this.glBuffers = [];
        this.currentVaoIdx = 0;
        this.particleCount = particleCount;
        this.vaos = [gl.createVertexArray(), gl.createVertexArray()];
        this.tfos = [gl.createTransformFeedback(), gl.createTransformFeedback()];
        this.initBuffers();
    }
    initBuffers() {
        this.glBuffers = [];
        for (let i = 0; i < 2; ++i) {
            gl.bindVertexArray(this.vaos[i]);
            particleShaderProgram.bind();
            this.glBuffers[i] = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.glBuffers[i]);
            gl.bufferData(gl.ARRAY_BUFFER, this.particleCount * PARTICLE_SIZE_BYTES, gl.STREAM_COPY);
            this.setVertexAttribPointers();
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.tfos[i]);
            gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.glBuffers[i]);
            gl.bindVertexArray(null);
        }
        this.currentVaoIdx = 0;
    }
    setVertexAttribPointers() {
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, PARTICLE_SIZE_BYTES, 0);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, PARTICLE_SIZE_BYTES, VECTOR2_SIZE_BYTES);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(2, 3, gl.FLOAT, false, PARTICLE_SIZE_BYTES, VECTOR2_SIZE_BYTES + VECTOR2_SIZE_BYTES);
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(3, 1, gl.FLOAT, false, PARTICLE_SIZE_BYTES, VECTOR2_SIZE_BYTES + VECTOR2_SIZE_BYTES + COLOR_SIZE_BYTES);
        gl.enableVertexAttribArray(3);
        gl.vertexAttribPointer(4, 1, gl.FLOAT, false, PARTICLE_SIZE_BYTES, VECTOR2_SIZE_BYTES + VECTOR2_SIZE_BYTES + COLOR_SIZE_BYTES + Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(4);
        gl.vertexAttribPointer(5, 1, gl.FLOAT, false, PARTICLE_SIZE_BYTES, VECTOR2_SIZE_BYTES + VECTOR2_SIZE_BYTES + COLOR_SIZE_BYTES + Float32Array.BYTES_PER_ELEMENT + Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(5);
    }
    draw(deltaTime) {
        const idx = (this.currentVaoIdx + 1) % 2;
        const vaoSource = this.vaos[this.currentVaoIdx];
        const transformFeedback = this.tfos[idx];
        gl.uniform1f(particleShaderTimeDeltaUniformLocation, deltaTime);
        gl.bindVertexArray(vaoSource);
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback);
        gl.beginTransformFeedback(gl.POINTS);
        gl.drawArrays(gl.POINTS, 0, this.particleCount);
        gl.endTransformFeedback();
        this.currentVaoIdx = idx;
    }
}
