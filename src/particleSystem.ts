import { gl } from './global.js'
import { particleShaderTimeDeltaUniformLocation, particleShaderProgram } from './resources/shaders/particleShader.js'
import { COLOR_SIZE_BYTES, getRandomColor } from './types/color.js'
import { Particle, PARTICLE_FLOAT_COUNT, PARTICLE_SIZE_BYTES } from './types/particle.js'
import { Vector2, VECTOR2_SIZE_BYTES } from './types/vector2.js'

export class ParticleSystem {
	private vaos: WebGLVertexArrayObject[] = []
	private tfos: WebGLTransformFeedback[] = []
	private glBuffers: WebGLBuffer[] = []
	private particleCount: number
	private currentVaoIdx: number = 0

	constructor(particleCount: number, position: Vector2) {
		this.particleCount = particleCount

		this.vaos = [gl.createVertexArray() as WebGLVertexArrayObject, gl.createVertexArray() as WebGLVertexArrayObject]
		this.tfos = [gl.createTransformFeedback() as WebGLTransformFeedback, gl.createTransformFeedback() as WebGLTransformFeedback]

		this.initBuffers()
	}

	private initBuffers() {
		this.glBuffers = []

		for (let i: number = 0; i < 2; ++i) {
			gl.bindVertexArray(this.vaos[i])

			particleShaderProgram.bind()

			this.glBuffers[i] = gl.createBuffer() as WebGLBuffer
			gl.bindBuffer(gl.ARRAY_BUFFER, this.glBuffers[i])
			gl.bufferData(gl.ARRAY_BUFFER, this.particleCount * PARTICLE_SIZE_BYTES, gl.STREAM_COPY)
			this.setVertexAttribPointers()

			gl.bindBuffer(gl.ARRAY_BUFFER, null)

			gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.tfos[i])
			gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.glBuffers[i])

			gl.bindVertexArray(null)
		}

		this.currentVaoIdx = 0
	}

	private setVertexAttribPointers() {
		// Position
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, PARTICLE_SIZE_BYTES, 0)
		gl.enableVertexAttribArray(0)

		// Velocity
		gl.vertexAttribPointer(1, 2, gl.FLOAT, false, PARTICLE_SIZE_BYTES, VECTOR2_SIZE_BYTES)
		gl.enableVertexAttribArray(1)

		// Color
		gl.vertexAttribPointer(2, 3, gl.FLOAT, false, PARTICLE_SIZE_BYTES, VECTOR2_SIZE_BYTES + VECTOR2_SIZE_BYTES)
		gl.enableVertexAttribArray(2)

		// Radius
		gl.vertexAttribPointer(3, 1, gl.FLOAT, false, PARTICLE_SIZE_BYTES, VECTOR2_SIZE_BYTES + VECTOR2_SIZE_BYTES + COLOR_SIZE_BYTES)
		gl.enableVertexAttribArray(3)

		// Life time
		gl.vertexAttribPointer(4, 1, gl.FLOAT, false, PARTICLE_SIZE_BYTES, VECTOR2_SIZE_BYTES + VECTOR2_SIZE_BYTES + COLOR_SIZE_BYTES + Float32Array.BYTES_PER_ELEMENT)
		gl.enableVertexAttribArray(4)

		// Age
		gl.vertexAttribPointer(5, 1, gl.FLOAT, false, PARTICLE_SIZE_BYTES, VECTOR2_SIZE_BYTES + VECTOR2_SIZE_BYTES + COLOR_SIZE_BYTES + Float32Array.BYTES_PER_ELEMENT + Float32Array.BYTES_PER_ELEMENT)
		gl.enableVertexAttribArray(5)
	}

	public draw(deltaTime: number) {
		const idx: number = (this.currentVaoIdx + 1) % 2
		const vaoSource: WebGLVertexArrayObject = this.vaos[this.currentVaoIdx]
		const transformFeedback: WebGLTransformFeedback = this.tfos[idx]

		gl.uniform1f(particleShaderTimeDeltaUniformLocation, deltaTime)

		gl.bindVertexArray(vaoSource)
		gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback)

		gl.beginTransformFeedback(gl.POINTS)
		gl.drawArrays(gl.POINTS, 0, this.particleCount)
		gl.endTransformFeedback()

		this.currentVaoIdx = idx
	}
}
