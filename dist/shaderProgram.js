import { ShaderCompileError } from './errors/shaderCompileError.js';
import { Graphics } from './graphics.js';
export class ShaderProgram {
    constructor(vertSrc, fragSrc, tfVaryings = null) {
        this.getUniformLocation = (name) => Graphics.ctx.getUniformLocation(this.program, name);
        this.unbind = () => Graphics.ctx.useProgram(null);
        this.bind = () => Graphics.ctx.useProgram(this.program);
        this.getFragmentShader = () => this.fragmentShader;
        this.getVertexShader = () => this.vertexShader;
        this.getProgram = () => this.program;
        this.program = Graphics.ctx.createProgram();
        this.fragmentShader = this.createShader(fragSrc, Graphics.ctx.FRAGMENT_SHADER);
        this.vertexShader = this.createShader(vertSrc, Graphics.ctx.VERTEX_SHADER);
        if (tfVaryings != null)
            Graphics.ctx.transformFeedbackVaryings(this.program, tfVaryings, Graphics.ctx.INTERLEAVED_ATTRIBS);
        Graphics.ctx.linkProgram(this.program);
        const infoLog = Graphics.ctx.getProgramInfoLog(this.program);
        if (infoLog && infoLog.length > 0)
            throw new ShaderCompileError(infoLog);
        Graphics.ctx.validateProgram(this.program);
    }
    createShader(src, type) {
        const shader = Graphics.ctx.createShader(type);
        Graphics.ctx.shaderSource(shader, src);
        Graphics.ctx.compileShader(shader);
        const infoLog = Graphics.ctx.getShaderInfoLog(shader);
        if (infoLog && infoLog.length > 0)
            throw new ShaderCompileError(infoLog);
        Graphics.ctx.attachShader(this.program, shader);
        return shader;
    }
}
