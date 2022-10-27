export class ShaderUniformNotFoundError extends Error {
    constructor(name) {
        super(`Shader uniform of name ${name} doesn't exist`);
    }
}
