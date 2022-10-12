import { ShaderCompileError } from './errors/shaderCompileError.js'
import { gl } from './global.js'

export class ShaderProgram {
	private program: WebGLProgram
	private vertexShader: WebGLShader
	private fragmentShader: WebGLShader

	constructor(vertSrc: string, fragSrc: string, tfVaryings: string[] | null = null) {
		this.program = gl.createProgram() as WebGLProgram

		this.fragmentShader = this.createShader(fragSrc, gl.FRAGMENT_SHADER)
		this.vertexShader = this.createShader(vertSrc, gl.VERTEX_SHADER)

		if (tfVaryings != null) gl.transformFeedbackVaryings(this.program, tfVaryings, gl.INTERLEAVED_ATTRIBS)

		gl.linkProgram(this.program)
		const infoLog: string | null = gl.getProgramInfoLog(this.program)
		if (infoLog && infoLog.length > 0) throw new ShaderCompileError(infoLog)

		gl.validateProgram(this.program)
	}

	private createShader(src: string, type: number): WebGLShader {
		const shader = gl.createShader(type) as WebGLShader
		gl.shaderSource(shader, src)

		gl.compileShader(shader)
		const infoLog: string | null = gl.getShaderInfoLog(shader)
		if (infoLog && infoLog.length > 0) throw new ShaderCompileError(infoLog)

		gl.attachShader(this.program, shader)
		return shader
	}

	public unbind = (): void => gl.useProgram(null)
	public bind = (): void => gl.useProgram(this.program)
	public getFragmentShader = (): WebGLShader => this.fragmentShader
	public getVertexShader = (): WebGLShader => this.vertexShader
	public getProgram = (): WebGLProgram => this.program
}
