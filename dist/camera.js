import { Graphics } from './graphics.js';
import { Matrix4 } from './math/matrix4.js';
export class Camera {
    constructor() {
        this.projectionMatrix = new Matrix4();
        this.position = { x: 0, y: 0 };
        this.zoom = 0.1;
        this.left = 0;
        this.right = 0;
        this.top = 0;
        this.bottom = 0;
        this.getProjectionMatrixValues = () => this.projectionMatrix.getValues();
        this.recalculate();
    }
    recalculate() {
        const invZoom = 1.0 / this.zoom;
        const halfWidth = Graphics.canvas.width * 0.5;
        const halfHeight = Graphics.canvas.height * 0.5;
        this.left = (this.position.x - halfWidth) * invZoom;
        this.right = (this.position.x + halfWidth) * invZoom;
        this.top = (this.position.y - halfHeight) * invZoom;
        this.bottom = (this.position.y + halfHeight) * invZoom;
        this.projectionMatrix.ortho(this.left, this.right, this.top, this.bottom, 0.0, 1.0);
    }
    screenToWorld(position) {
        const width = this.right - this.left;
        const height = this.bottom - this.top;
        return { x: this.left + (position.x / Graphics.canvas.width) * width, y: this.top + (position.y / Graphics.canvas.height) * height };
    }
}
