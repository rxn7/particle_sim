export namespace Logger {
	export enum Color {
		WHITE = '0',
		BLACK = '30',
		RED = '31',
		GREEN = '32',
		YELLOW = '33',
		BLUE = '34',
		MAGENTA = '35',
		CYAN = '36',
		GRAY = '37',
	}

	export function LogInit(moduleName: string): void {
		Logger.Log(`${moduleName} module initialized`, Color.GREEN)
	}

	export function Log(text: string, color: Color = Color.WHITE): void {
		console.log(`\x1B[${color}m${text}`)
	}
}
