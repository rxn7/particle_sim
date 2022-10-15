export class ShaderCompileError extends Error {
    constructor(msg) {
        super(`Failed to compile shader: ${msg}`);
        alert(this.message);
    }
}
