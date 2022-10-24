import { camera, gl, shaders } from './global.js'
import { COLOR_SIZE_BYTES } from './math/color.js'
import { Vector2, VECTOR2_SIZE_BYTES } from './math/vector2.js'
import { FLOAT_SIZE_BYTES } from './helpers/sizes.js'

export const PARTICLE_SIZE_BYTES: number = VECTOR2_SIZE_BYTES + VECTOR2_SIZE_BYTES + COLOR_SIZE_BYTES + FLOAT_SIZE_BYTES + FLOAT_SIZE_BYTES + FLOAT_SIZE_BYTES

export class ParticleSystem {
	private vaos: WebGLVertexArrayObject[] = []
	private tfos: WebGLTransformFeedback[] = []
	private tfBuffersa: WebGLBuffer[] = []
	private particleCount: number
	private currentVaoIdx: number = 0

	constructor(particleCount: number) {
		this.particleCount = particleCount

		this.vaos = [gl.createVertexArray() as WebGLVertexArrayObject, gl.createVertexArray() as WebGLVertexArrayObject]
		this.tfos = [gl.createTransformFeedback() as WebGLTransformFeedback, gl.createTransformFeedback() as WebGLTransformFeedback]

		window.addEventListener('mousemove', ev => {
			this.handleMouseMove({ x: ev.clientX, y: ev.clientY })
		})

		this.initBuffers()
	}

	private initBuffers(): void {
		this.tfBuffersa = []

		for (let i: number = 0; i < 2; ++i) {
			gl.bindVertexArray(this.vaos[i])

			shaders.particleShaderProgram.bind()

			this.tfBuffersa[i] = gl.createBuffer() as WebGLBuffer
			gl.bindBuffer(gl.ARRAY_BUFFER, this.tfBuffersa[i])
			gl.bufferData(gl.ARRAY_BUFFER, this.particleCount * PARTICLE_SIZE_BYTES, gl.DYNAMIC_COPY)
			this.setVertexAttribPointers()

			gl.bindBuffer(gl.ARRAY_BUFFER, null)

			gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.tfos[i])
			gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.tfBuffersa[i])

			gl.bindVertexArray(null)
		}

		this.currentVaoIdx = 0
	}

	public handleMouseMove(position: Vector2): void {
		const origin: Vector2 = camera.screenToWorld(position)
		gl.uniform2f(shaders.particleShaderProgram.uniforms.origin, origin.x, origin.y)
	}

	private setVertexAttribPointers(): void {
		let offset: number = 0
		let idx: number = 0

		// Position
		gl.vertexAttribPointer(idx, 2, gl.FLOAT, false, PARTICLE_SIZE_BYTES, 0)
		gl.enableVertexAttribArray(idx++)
		offset += VECTOR2_SIZE_BYTES

		// Velocity
		gl.vertexAttribPointer(idx, 2, gl.FLOAT, false, PARTICLE_SIZE_BYTES, offset)
		gl.enableVertexAttribArray(idx++)
		offset += VECTOR2_SIZE_BYTES

		// Color
		gl.vertexAttribPointer(idx, 3, gl.FLOAT, false, PARTICLE_SIZE_BYTES, offset)
		gl.enableVertexAttribArray(idx++)
		offset += COLOR_SIZE_BYTES

		// Radius
		gl.vertexAttribPointer(idx, 1, gl.FLOAT, false, PARTICLE_SIZE_BYTES, offset)
		gl.enableVertexAttribArray(idx++)
		offset += FLOAT_SIZE_BYTES

		// Life time
		gl.vertexAttribPointer(idx, 1, gl.FLOAT, false, PARTICLE_SIZE_BYTES, offset)
		gl.enableVertexAttribArray(idx++)
		offset += FLOAT_SIZE_BYTES

		// Max life time
		gl.vertexAttribPointer(idx, 1, gl.FLOAT, false, PARTICLE_SIZE_BYTES, offset)
		gl.enableVertexAttribArray(idx++)
		offset += FLOAT_SIZE_BYTES
	}

	public draw(): void {
		const idx: number = (this.currentVaoIdx + 1) % 2
		const vaoSource: WebGLVertexArrayObject = this.vaos[this.currentVaoIdx]
		const transformFeedback: WebGLTransformFeedback = this.tfos[idx]

		gl.bindVertexArray(vaoSource)
		gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback)

		gl.beginTransformFeedback(gl.POINTS)
		gl.drawArrays(gl.POINTS, 0, this.particleCount)
		gl.endTransformFeedback()

		this.currentVaoIdx = idx
	}
}
