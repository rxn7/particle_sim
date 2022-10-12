export class WebGL2NotSupportedError extends Error {
	constructor() {
		super('WebGL2 is not supported on this browser!')

		document.body.innerHTML = ''

		const errorText: HTMLParagraphElement = document.createElement('p')
		errorText.className = 'webgl2-not-supported-error'
		errorText.innerText = 'WebGL2 is not supported on this browser!'

		document.body.appendChild(errorText)
	}
}
