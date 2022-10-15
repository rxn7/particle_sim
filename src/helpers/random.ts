export namespace random {
	export const range = (min: number, max: number) => Math.random() * (max - min) + min
}
