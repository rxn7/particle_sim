import { camera, canvas, gl } from './global.js'
import { partcileShaderUniforms, particleShaderProgram } from './resources/shaders/particleShader.js'
import { COLOR_SIZE_BYTES, getRandomColor } from './types/color.js'
import { PARTICLE_SIZE_BYTES } from './types/particle.js'
import { Vector2, VECTOR2_SIZE_BYTES } from './types/vector2.js'

export class ParticleSystem {
	private vaos: WebGLVertexArrayObject[] = []
	private tfos: WebGLTransformFeedback[] = []
	private tfBuffersa: WebGLBuffer[] = []
	private particleCount: number
	private currentVaoIdx: number = 0
	private origin: Vector2
	private mouseClicked: boolean = true

	constructor(particleCount: number, origin: Vector2 = { x: 0, y: 0 }) {
		this.particleCount = particleCount
		this.origin = origin

		this.vaos = [gl.createVertexArray() as WebGLVertexArrayObject, gl.createVertexArray() as WebGLVertexArrayObject]
		this.tfos = [gl.createTransformFeedback() as WebGLTransformFeedback, gl.createTransformFeedback() as WebGLTransformFeedback]

		window.addEventListener('mousedown', ev => {
			this.handleMouseClick({ x: ev.clientX, y: ev.clientY })
		})

		this.initBuffers()
	}

	private initBuffers() {
		this.tfBuffersa = []

		for (let i: number = 0; i < 2; ++i) {
			gl.bindVertexArray(this.vaos[i])

			particleShaderProgram.bind()

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

	public handleMouseClick(position: Vector2) {
		this.origin = camera.screenToWorld(position)
		this.mouseClicked = true
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
	}

	public draw() {
		const idx: number = (this.currentVaoIdx + 1) % 2
		const vaoSource: WebGLVertexArrayObject = this.vaos[this.currentVaoIdx]
		const transformFeedback: WebGLTransformFeedback = this.tfos[idx]

		gl.uniform1i(partcileShaderUniforms.randomize, +this.mouseClicked)
		gl.uniform2f(partcileShaderUniforms.origin, this.origin.x, this.origin.y)

		gl.bindVertexArray(vaoSource)
		gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback)

		gl.beginTransformFeedback(gl.POINTS)
		gl.drawArrays(gl.POINTS, 0, this.particleCount)
		gl.endTransformFeedback()

		this.currentVaoIdx = idx
		this.mouseClicked = false
	}
}
