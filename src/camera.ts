import { canvas } from './global.js'
import { Matrix4 } from './types/matrix4.js'
import { Vector2 } from './types/vector2.js'

export class Camera {
	private projectionMatrix: Matrix4 = new Matrix4()
	public position: Vector2 = { x: 0, y: 0 }
	public zoom: number = 0.1
	private left: number = 0
	private right: number = 0
	private top: number = 0
	private bottom: number = 0

	constructor() {
		this.recalculate()
	}

	public recalculate(): void {
		const invZoom: number = 1.0 / this.zoom

		const halfWidth: number = canvas.width * 0.5
		const halfHeight: number = canvas.height * 0.5
		this.left = (this.position.x - halfWidth) * invZoom
		this.right = (this.position.x + halfWidth) * invZoom
		this.top = (this.position.y - halfHeight) * invZoom
		this.bottom = (this.position.y + halfHeight) * invZoom

		this.projectionMatrix.ortho(this.left, this.right, this.top, this.bottom, 0.0, 1.0)
	}

	public screenToWorld(position: Vector2): Vector2 {
		const width = this.right - this.left
		const height = this.bottom - this.top

		return { x: this.left + (position.x / canvas.width) * width, y: this.top + (position.y / canvas.height) * height }
	}

	public getProjectionMatrixValues = (): Float32Array => this.projectionMatrix.getValues()
}
