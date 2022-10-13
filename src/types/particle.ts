import { Color } from './color.js'
import { Vector2 } from './vector2.js'

export type Particle = {
	position: Vector2
	velocity: Vector2
	color: Color
	radius: number
}

export const PARTICLE_FLOAT_COUNT: number = 2 + 2 + 3 + 1
export const PARTICLE_SIZE_BYTES: number = PARTICLE_FLOAT_COUNT * Float32Array.BYTES_PER_ELEMENT
