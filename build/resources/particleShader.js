import { ShaderProgram } from '../shader.js';
const PARTICLE_VERTEX_SHADER = `
    out vec4 output1;
    out float output2;
`;
const PARTICLE_FRAGMENT_SHADER = `
    out vec4 output1;
    out float output2;
`;
export const particleShaderProgram = new ShaderProgram(PARTICLE_VERTEX_SHADER, PARTICLE_FRAGMENT_SHADER);
