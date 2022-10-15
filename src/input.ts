import { Vector2 } from './math/vector2.js'

export namespace Input {
	export let lastMousePosition: Vector2
	export let mousePosition: Vector2

	export let buttons = {
		leftMouse: false,
		rightMouse: false,
	}

	window.addEventListener('contextmenu', e => e.preventDefault())

	window.addEventListener('mousedown', (ev: MouseEvent) => {
		switch (ev.button) {
			case 0:
				buttons.leftMouse = true
				break
			case 2:
				buttons.rightMouse = true
				break
		}
	})

	window.addEventListener('mouseup', (ev: MouseEvent) => {
		switch (ev.button) {
			case 0:
				buttons.leftMouse = false
				break
			case 2:
				buttons.rightMouse = false
				break
		}
	})

	window.addEventListener('mousemove', (ev: MouseEvent) => {
		lastMousePosition = mousePosition
		mousePosition = { x: ev.clientX, y: ev.clientY }
	})

	export function getMousePositionDelta(): Vector2 {
		return { x: lastMousePosition.x - lastMousePosition.x, y: lastMousePosition.y - lastMousePosition.y }
	}
}
