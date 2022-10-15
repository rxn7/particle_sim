export namespace Math {
	export function clamp(v: number, min: number, max: number): number {
		if (v < min) return min
		if (v > max) return max
		return v
	}
}
