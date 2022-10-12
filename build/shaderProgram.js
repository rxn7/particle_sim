import { ShaderCompileError } from './errors/shaderCompileError.js';
import { gl } from './global.js';
export class ShaderProgram {
    constructor(vertSrc, fragSrc, tfVaryings = null) {
        this.unbind = () => gl.useProgram(null);
        this.bind = () => gl.useProgram(this.program);
        this.getFragmentShader = () => this.fragmentShader;
        this.getVertexShader = () => this.vertexShader;
        this.getProgram = () => this.program;
        this.program = gl.createProgram();
        this.fragmentShader = this.createShader(fragSrc, gl.FRAGMENT_SHADER);
        this.vertexShader = this.createShader(vertSrc, gl.VERTEX_SHADER);
        if (tfVaryings != null)
            gl.transformFeedbackVaryings(this.program, tfVaryings, gl.INTERLEAVED_ATTRIBS);
        gl.linkProgram(this.program);
        const infoLog = gl.getProgramInfoLog(this.program);
        if (infoLog && infoLog.length > 0)
            throw new ShaderCompileError(infoLog);
        gl.validateProgram(this.program);
    }
    createShader(src, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        const infoLog = gl.getShaderInfoLog(shader);
        if (infoLog && infoLog.length > 0)
            throw new ShaderCompileError(infoLog);
        gl.attachShader(this.program, shader);
        return shader;
    }
}
