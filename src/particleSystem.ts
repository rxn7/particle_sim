import { COLOR_SIZE_BYTES } from './math/color.js'
import { Vector2, VECTOR2_SIZE_BYTES } from './math/vector2.js'
import { FLOAT_SIZE_BYTES } from './helpers/sizes.js'
import { Graphics } from './graphics.js'
import { Global } from './global.js'
import { Resources } from './resources.js'

export const PARTICLE_SIZE_BYTES: number = VECTOR2_SIZE_BYTES + VECTOR2_SIZE_BYTES + COLOR_SIZE_BYTES + FLOAT_SIZE_BYTES + FLOAT_SIZE_BYTES + FLOAT_SIZE_BYTES

export class ParticleSystem {
	private vaos: WebGLVertexArrayObject[] = []
	private tfos: WebGLTransformFeedback[] = []
	private tfBuffersa: WebGLBuffer[] = []
	private particleCount: number
	private currentVaoIdx: number = 0

	constructor(particleCount: number) {
		this.particleCount = particleCount

		this.vaos = [Graphics.ctx.createVertexArray() as WebGLVertexArrayObject, Graphics.ctx.createVertexArray() as WebGLVertexArrayObject]
		this.tfos = [Graphics.ctx.createTransformFeedback() as WebGLTransformFeedback, Graphics.ctx.createTransformFeedback() as WebGLTransformFeedback]

		window.addEventListener('mousemove', ev => {
			this.handleMouseMove({ x: ev.clientX, y: ev.clientY })
		})

		this.initBuffers()
	}

	private initBuffers(): void {
		this.tfBuffersa = []

		for (let i: number = 0; i < 2; ++i) {
			Graphics.ctx.bindVertexArray(this.vaos[i])

			Resources.shaders.particleShaderProgram?.bind()

			this.tfBuffersa[i] = Graphics.ctx.createBuffer() as WebGLBuffer
			Graphics.ctx.bindBuffer(Graphics.ctx.ARRAY_BUFFER, this.tfBuffersa[i])
			Graphics.ctx.bufferData(Graphics.ctx.ARRAY_BUFFER, this.particleCount * PARTICLE_SIZE_BYTES, Graphics.ctx.DYNAMIC_COPY)
			this.setVertexAttribPointers()

			Graphics.ctx.bindBuffer(Graphics.ctx.ARRAY_BUFFER, null)

			Graphics.ctx.bindTransformFeedback(Graphics.ctx.TRANSFORM_FEEDBACK, this.tfos[i])
			Graphics.ctx.bindBufferBase(Graphics.ctx.TRANSFORM_FEEDBACK_BUFFER, 0, this.tfBuffersa[i])

			Graphics.ctx.bindVertexArray(null)
		}

		this.currentVaoIdx = 0
	}

	public handleMouseMove(position: Vector2): void {
		const origin: Vector2 = Global.camera.screenToWorld(position)
		Graphics.ctx.uniform2f(Resources.shaders.particleShaderProgram?.uniforms.origin, origin.x, origin.y)
	}

	private setVertexAttribPointers(): void {
		let offset: number = 0
		let idx: number = 0

		// Position
		Graphics.ctx.vertexAttribPointer(idx, 2, Graphics.ctx.FLOAT, false, PARTICLE_SIZE_BYTES, 0)
		Graphics.ctx.enableVertexAttribArray(idx++)
		offset += VECTOR2_SIZE_BYTES

		// Velocity
		Graphics.ctx.vertexAttribPointer(idx, 2, Graphics.ctx.FLOAT, false, PARTICLE_SIZE_BYTES, offset)
		Graphics.ctx.enableVertexAttribArray(idx++)
		offset += VECTOR2_SIZE_BYTES

		// Color
		Graphics.ctx.vertexAttribPointer(idx, 3, Graphics.ctx.FLOAT, false, PARTICLE_SIZE_BYTES, offset)
		Graphics.ctx.enableVertexAttribArray(idx++)
		offset += COLOR_SIZE_BYTES

		// Radius
		Graphics.ctx.vertexAttribPointer(idx, 1, Graphics.ctx.FLOAT, false, PARTICLE_SIZE_BYTES, offset)
		Graphics.ctx.enableVertexAttribArray(idx++)
		offset += FLOAT_SIZE_BYTES

		// Life time
		Graphics.ctx.vertexAttribPointer(idx, 1, Graphics.ctx.FLOAT, false, PARTICLE_SIZE_BYTES, offset)
		Graphics.ctx.enableVertexAttribArray(idx++)
		offset += FLOAT_SIZE_BYTES

		// Max life time
		Graphics.ctx.vertexAttribPointer(idx, 1, Graphics.ctx.FLOAT, false, PARTICLE_SIZE_BYTES, offset)
		Graphics.ctx.enableVertexAttribArray(idx++)
		offset += FLOAT_SIZE_BYTES
	}

	public draw(): void {
		const idx: number = (this.currentVaoIdx + 1) % 2
		const vaoSource: WebGLVertexArrayObject = this.vaos[this.currentVaoIdx]
		const transformFeedback: WebGLTransformFeedback = this.tfos[idx]

		Graphics.ctx.bindVertexArray(vaoSource)
		Graphics.ctx.bindTransformFeedback(Graphics.ctx.TRANSFORM_FEEDBACK, transformFeedback)

		Graphics.ctx.beginTransformFeedback(Graphics.ctx.POINTS)
		Graphics.ctx.drawArrays(Graphics.ctx.POINTS, 0, this.particleCount)
		Graphics.ctx.endTransformFeedback()

		this.currentVaoIdx = idx
	}
}
