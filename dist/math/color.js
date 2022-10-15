export function getRandomColor() {
    return {
        r: Math.random(),
        g: Math.random(),
        b: Math.random(),
    };
}
export const COLOR_SIZE_BYTES = 3 * Float32Array.BYTES_PER_ELEMENT;
