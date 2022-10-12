export class ShaderCompileError extends Error {
	constructor(msg: string) {
		super(`Failed to compile shader: ${msg}`)
		alert(this.message)
	}
}
