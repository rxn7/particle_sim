export const SHADER_RAND_FUNC = `
    const float PHI = 1.61803398874989484820459 * 00000.1; // Golden Ratio   
    const float PI  = 3.14159265358979323846264 * 00000.1; // PI
    const float SRT = 1.41421356237309504880169 * 10000.0; // Square Root of Two

    float rand(vec2 coordinate, float seed) {
        return fract(sin(dot(coordinate*seed, vec2(PHI, PI)))*SRT);
    }
`;
