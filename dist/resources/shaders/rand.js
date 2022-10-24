export const SHADER_RAND_FUNC = `
    const float PHI = 1.61803398874989484820459 * 00000.1; // Golden Ratio   
    const float PI  = 3.14159265358979323846264 * 00000.1; // PI
    const float SRT = 1.41421356237309504880169 * 10000.0; // Square Root of Two

    int rand(int n) {
        n = (n << 13) ^ n;
        return (n * (n*n*15731+789221) + 1376312589) & 0x7fffffff;
    }

    float randf(int n) {
        return rand(n) * (1.0 / 1073741824.0);
    }
`;
