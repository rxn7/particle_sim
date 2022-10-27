import { ShaderCompileError } from './errors/shaderCompileError.js'
import { Graphics } from './graphics.js'

export class ShaderProgram {
	public uniforms: any
	protected program: WebGLProgram
	protected vertexShader: WebGLShader
	protected fragmentShader: WebGLShader

	protected constructor(vertSrc: string, fragSrc: string, tfVaryings: string[] | null = null) {
		this.program = Graphics.ctx.createProgram() as WebGLProgram

		this.fragmentShader = this.createShader(fragSrc, Graphics.ctx.FRAGMENT_SHADER)
		this.vertexShader = this.createShader(vertSrc, Graphics.ctx.VERTEX_SHADER)

		if (tfVaryings != null) Graphics.ctx.transformFeedbackVaryings(this.program, tfVaryings, Graphics.ctx.INTERLEAVED_ATTRIBS)

		Graphics.ctx.linkProgram(this.program)
		const infoLog: string | null = Graphics.ctx.getProgramInfoLog(this.program)
		if (infoLog && infoLog.length > 0) throw new ShaderCompileError(infoLog)

		Graphics.ctx.validateProgram(this.program)
	}

	private createShader(src: string, type: number): WebGLShader {
		const shader = Graphics.ctx.createShader(type) as WebGLShader
		Graphics.ctx.shaderSource(shader, src)

		Graphics.ctx.compileShader(shader)
		const infoLog: string | null = Graphics.ctx.getShaderInfoLog(shader)
		if (infoLog && infoLog.length > 0) throw new ShaderCompileError(infoLog)

		Graphics.ctx.attachShader(this.program, shader)
		return shader
	}

	public getUniformLocation = (name: string): WebGLUniformLocation => Graphics.ctx.getUniformLocation(this.program, name) as WebGLUniformLocation
	public unbind = (): void => Graphics.ctx.useProgram(null)
	public bind = (): void => Graphics.ctx.useProgram(this.program)

	public getFragmentShader = (): WebGLShader => this.fragmentShader
	public getVertexShader = (): WebGLShader => this.vertexShader
	public getProgram = (): WebGLProgram => this.program
}
