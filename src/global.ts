import { Camera } from './camera.js'
import { Logger } from './logger.js'

export namespace Global {
	export let camera: Camera

	export function init(): void {
		camera = new Camera()

		Logger.LogInit('Global')
	}
}
