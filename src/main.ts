import { Graphics } from './graphics.js'
import { ParticleSystem } from './particleSystem.js'
import { Debug } from './debug.js'
import { Global } from './global.js'
import { Resources } from './resources.js'
import { Logger } from './logger.js'

const PARTICLE_COUNT: number = 10_000
let particleSystem: ParticleSystem
let oldTimeStamp: DOMHighResTimeStamp = 0

function init(): void {
	Graphics.init()
	Resources.init()
	Global.init()
	particleSystem = new ParticleSystem(PARTICLE_COUNT)
	updateSize()
	requestAnimationFrame(animationFrame)
}

function animationFrame(timeStamp: DOMHighResTimeStamp): void {
	requestAnimationFrame(animationFrame)
	update(timeStamp)
	Graphics.clear()
	Graphics.draw(particleSystem)
}

function update(timeStamp: DOMHighResTimeStamp): void {
	const timeDelta = oldTimeStamp == 0 ? 0 : (timeStamp - oldTimeStamp) / 1000
	oldTimeStamp = timeStamp

	Debug.update({ timeDelta: timeDelta, particleCount: PARTICLE_COUNT })

	Graphics.ctx.uniform1i(Resources.shaders.particleShaderProgram?.uniforms.time, timeStamp * 1000)
	Graphics.ctx.uniform1f(Resources.shaders.particleShaderProgram?.uniforms.timeDelta, timeDelta)
	Graphics.ctx.uniformMatrix4fv(Resources.shaders.particleShaderProgram?.uniforms.projectionMatrix, false, Global.camera.getProjectionMatrixValues())
}

function updateSize(): void {
	const width: number = Math.trunc(window.visualViewport?.width || window.innerWidth)
	const height: number = Math.trunc(window.visualViewport?.height || window.innerHeight)

	if (width === 0 || height === 0) return

	Logger.Log(`New canvas size: ${width}x${height}`, Logger.Color.CYAN)

	Graphics.canvas.width = width
	Graphics.canvas.height = height
	Graphics.ctx.viewport(0, 0, width, height)

	Global.camera.recalculate()
}

document.addEventListener('DOMContentLoaded', init)
window.addEventListener('resize', updateSize)
