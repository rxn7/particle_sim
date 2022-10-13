import { camera, canvas, gl } from './global.js'
import { WebGL2NotSupportedError } from './errors/webGL2Error.js'
import { ParticleSystem } from './particleSystem.js'
import { partcileShaderUniforms as particleShaderUniforms, particleShaderProgram } from './resources/shaders/particleShader.js'

const particleSystem: ParticleSystem = new ParticleSystem(500, { x: 0, y: 0.2 })
let oldTimeStamp: DOMHighResTimeStamp = 0

function init() {
	if (!gl) throw new WebGL2NotSupportedError()

	updateSize()
	requestAnimationFrame(animationFrame)
}

function animationFrame(timeStamp: DOMHighResTimeStamp): void {
	requestAnimationFrame(animationFrame)
	update(timeStamp)
	draw()
}

function update(timeStamp: DOMHighResTimeStamp) {
	const timeDelta = oldTimeStamp == 0 ? 0 : (timeStamp - oldTimeStamp) / 1000
	oldTimeStamp = timeStamp

	gl.uniform1f(particleShaderUniforms.time, timeStamp)
	gl.uniform1f(particleShaderUniforms.timeDelta, timeDelta)
	gl.uniformMatrix4fv(particleShaderUniforms.projectionMatrix, false, camera.getProjectionMatrixValues())
}

function draw() {
	gl.clearColor(0.0, 0.0, 0, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT)

	particleSystem.draw()
}

function updateSize() {
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
