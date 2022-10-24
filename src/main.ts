import { camera, canvas, gl, shaders } from './global.js'
import { WebGL2NotSupportedError } from './errors/webGL2Error.js'
import { ParticleSystem } from './particleSystem.js'
import { Debug } from './debug.js'

const PARTICLE_COUNT: number = 10_000
const particleSystem: ParticleSystem = new ParticleSystem(PARTICLE_COUNT)
let oldTimeStamp: DOMHighResTimeStamp = 0

function init(): void {
	if (!gl) throw new WebGL2NotSupportedError()

	gl.enable(gl.BLEND)
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

	gl.uniform1i(shaders.particleShaderProgram.uniforms.init, 1)

	updateSize()
	requestAnimationFrame(animationFrame)
}

function animationFrame(timeStamp: DOMHighResTimeStamp): void {
	requestAnimationFrame(animationFrame)
	update(timeStamp)
	draw()
}

function update(timeStamp: DOMHighResTimeStamp): void {
	const timeDelta = oldTimeStamp == 0 ? 0 : (timeStamp - oldTimeStamp) / 1000
	oldTimeStamp = timeStamp

	Debug.update({ timeDelta: timeDelta, particleCount: PARTICLE_COUNT })

	gl.uniform1i(shaders.particleShaderProgram.uniforms.time, timeStamp * 1000)
	gl.uniform1f(shaders.particleShaderProgram.uniforms.timeDelta, timeDelta)
	gl.uniformMatrix4fv(shaders.particleShaderProgram.uniforms.projectionMatrix, false, camera.getProjectionMatrixValues())
}

function draw(): void {
	gl.clearColor(0.0, 0.0, 0, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT)

	particleSystem.draw()
	gl.uniform1i(shaders.particleShaderProgram.uniforms.init, 0)
}

function updateSize(): void {
	const width: number = Math.trunc(window.visualViewport?.width || window.innerWidth)
	const height: number = Math.trunc(window.visualViewport?.height || window.innerHeight)

	if (width === 0 || height === 0) return

	console.log(`Resizing: ${width}x${height}`)

	canvas.width = width
	canvas.height = height
	gl.viewport(0, 0, width, height)

	camera.recalculate()
}

document.addEventListener('DOMContentLoaded', init)
window.addEventListener('resize', updateSize)
