export class ShaderProgramLinkError extends Error {
    constructor(msg) {
        super(`Failed to link shader program: ${msg}`);
        alert(this.message);
    }
}
