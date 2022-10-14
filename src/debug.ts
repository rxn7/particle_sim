export namespace Debug {
	const debugRootElement: HTMLDivElement = document.getElementById('debug') as HTMLDivElement
	const particleCountElement: HTMLParagraphElement = document.getElementById('debug-particle-count') as HTMLParagraphElement
	const fpsElement: HTMLParagraphElement = document.getElementById('debug-fps') as HTMLParagraphElement
	const frameTimeElement: HTMLParagraphElement = document.getElementById('debug-frame-time') as HTMLParagraphElement
	let isHidden: boolean = false

	export type DebugData = {
		timeDelta: number
		particleCount: number
	}

	export function update(data: DebugData): void {
		if (debugRootElement.hidden) return

		fpsElement.innerText = `fps: ${Math.trunc(1.0 / data.timeDelta)}`
		particleCountElement.innerText = `particle count: ${data.particleCount}`
		frameTimeElement.innerText = `frame time: ${data.timeDelta.toFixed(5)}ms`
	}

	window.addEventListener('keypress', (ev: KeyboardEvent) => {
		if (ev.key === 'p') toggleHide()
	})

	function toggleHide() {
		if (!isHidden) {
			debugRootElement.style.visibility = 'hidden'
			isHidden = true
		} else {
			debugRootElement.style.visibility = 'visible'
			isHidden = false
		}
	}
}
