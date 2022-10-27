import { Logger } from './logger.js'
import { ParticleShaderProgram } from './resources/shaders/particleShaderProgram.js'

export namespace Resources {
	interface Shaders {
		particleShaderProgram?: ParticleShaderProgram
	}

	export const shaders: Shaders = {}

	export function init() {
		shaders.particleShaderProgram = new ParticleShaderProgram()

		Logger.LogInit('Resources')
	}
}
