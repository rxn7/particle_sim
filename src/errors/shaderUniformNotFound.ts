export class ShaderUniformNotFoundError extends Error {
	constructor(name: string) {
		super(`Shader uniform of name ${name} doesn't exist`)
	}
}
