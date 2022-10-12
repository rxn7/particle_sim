import { Color, COLOR_SIZE_BYTES } from './color.js'
import { Vector2, VECTOR2_SIZE_BYTES } from './vector2.js'

export type Particle = {
	position: Vector2
	velocity: Vector2
	color: Color
	radius: number
	lifeTime: number
}

export const PARTICLE_FLOAT_COUNT: number = 2 + 2 + 3 + 1 + 1
export const PARTICLE_SIZE_BYTES: number = PARTICLE_FLOAT_COUNT * Float32Array.BYTES_PER_ELEMENT
