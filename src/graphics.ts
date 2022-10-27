import { WebGL2NotSupportedError } from './errors/webGL2Error.js'
import { Logger } from './logger.js'
import { ParticleSystem } from './particleSystem.js'
import { Resources } from './resources.js'

export namespace Graphics {
	export const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement
	export const ctx: WebGL2RenderingContext = canvas.getContext('webgl2') as WebGL2RenderingContext

	export function init(): void {
		if (!ctx) throw new WebGL2NotSupportedError()
		initGl()

		Logger.LogInit('Graphics')
	}

	export function clear(): void {
		ctx.clearColor(0.0, 0.0, 0, 1.0)
		ctx.clear(ctx.COLOR_BUFFER_BIT)
	}

	export function draw(particleSystem: ParticleSystem) {
		particleSystem.draw()
		ctx.uniform1i(Resources.shaders.particleShaderProgram?.uniforms.init, 0) // TODO: Handle this better
	}

	function initGl(): void {
		ctx.enable(ctx.BLEND)
		ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA)
	}
}
