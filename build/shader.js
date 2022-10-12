import { gl } from './global.js';
export class ShaderProgram {
    constructor(vertSrc, fragSrc) {
        this.getFragmentShader = () => this.fragmentShader;
        this.getVertexShader = () => this.vertexShader;
        this.getProgram = () => this.program;
        this.program = gl.createProgram();
        this.fragmentShader = this.createShader(fragSrc, gl.FRAGMENT_SHADER);
        this.vertexShader = this.createShader(vertSrc, gl.VERTEX_SHADER);
        gl.linkProgram(this.program);
    }
    createShader(src, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        gl.attachShader(this.program, shader);
        return shader;
    }
}
