import { Camera } from './camera.js';
import { ParticleShaderProgram } from './resources/shaders/particleShaderProgram.js';
export const canvas = document.getElementById('canvas');
export const gl = canvas.getContext('webgl2');
export const camera = new Camera();
export const shaders = {
    particleShaderProgram: new ParticleShaderProgram(),
};
