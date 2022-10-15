import { Camera } from './camera.js'
import { ParticleShaderProgram } from './resources/shaders/particleShaderProgram.js'

export const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement
export const gl: WebGL2RenderingContext = canvas.getContext('webgl2') as WebGL2RenderingContext
export const camera: Camera = new Camera()
export const shaders = {
	particleShaderProgram: new ParticleShaderProgram(),
}
