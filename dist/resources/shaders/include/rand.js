export const SHADER_RAND_FUNC = `
    uint rand(uint seed) {
        seed = (seed ^ 61u) ^ (seed >> 16u);
        seed *= 9u;
        seed = seed ^ (seed >> 4u);
        seed *= 0x27d4eb2du;
        seed = seed ^ (seed >> 15u);
        return seed;
    }

    float randf(uint seed) {
        return float(rand(seed)) * (1.0 / 4294967296.0);
    }
`;
