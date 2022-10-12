import { canvas, gl } from './global.js'
import { WebGL2NotSupportedError } from './errors/webGL2Error.js'
import { ParticleSystem } from './particleSystem.js'
import { Vector2 } from './types/vector2.js'

const particleSystem: ParticleSystem = new ParticleSystem(5, { x: 0, y: 0 })
let oldTimeStamp: DOMHighResTimeStamp = 0

function init() {
	if (!gl) throw new WebGL2NotSupportedError()

	updateSize()
	requestAnimationFrame(animationFrame)
}

function animationFrame(timeStamp: DOMHighResTimeStamp): void {
	requestAnimationFrame(animationFrame)

	const timeDelta = oldTimeStamp == 0 ? 0 : (timeStamp - oldTimeStamp) / 1000
	oldTimeStamp = timeStamp

	gl.clearColor(0.0, 0.0, 0, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT)

	particleSystem.draw(timeDelta)
}

function updateSize() {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	gl.viewport(0, 0, canvas.width, canvas.height)
}

document.addEventListener('DOMContentLoaded', init)
document.addEventListener('resize', updateSize)
document.addEventListener('mousedown', ev => {
	const position: Vector2 = { x: ev.clientX / window.innerWidth, y: ev.clientY / window.innerHeight }
})
