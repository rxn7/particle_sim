export type Color = {
	r: GLclampf
	g: GLclampf
	b: GLclampf
}

export function getRandomColor(): Color {
	return {
		r: Math.random(),
		g: Math.random(),
		b: Math.random(),
	}
}

export const COLOR_SIZE_BYTES: number = 3 * Float32Array.BYTES_PER_ELEMENT
