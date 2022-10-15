export class ShaderProgramLinkError extends Error {
	constructor(msg: string) {
		super(`Failed to link shader program: ${msg}`)
		alert(this.message)
	}
}
