export class Matrix4 {
    constructor() {
        this.values = new Float32Array(16);
        this.getValues = () => this.values;
    }
    reset() {
        for (let i = 0; i < 16; ++i)
            this.values[i] = 0;
    }
    identity() {
        this.values[0] = 1;
        this.values[1] = 0;
        this.values[2] = 0;
        this.values[3] = 0;
        this.values[4] = 0;
        this.values[5] = 1;
        this.values[6] = 0;
        this.values[7] = 0;
        this.values[8] = 0;
        this.values[9] = 0;
        this.values[10] = 1;
        this.values[11] = 0;
        this.values[12] = 0;
        this.values[13] = 0;
        this.values[14] = 0;
        this.values[15] = 1;
    }
    ortho(l, r, t, b, near, far) {
        const rl = r - l;
        const tb = t - b;
        const fn = far - near;
        this.reset();
        this.values[0] = 2 / rl;
        this.values[5] = 2 / tb;
        this.values[10] = -2 / fn;
        this.values[12] = -(l + r) / rl;
        this.values[13] = -(t + b) / tb;
        this.values[14] = -(far + near) / fn;
        this.values[15] = 1;
    }
    translate(vec) {
        this.values[12] = this.values[12] + this.values[0] * vec.x + this.values[4] * vec.y;
        this.values[13] = this.values[13] + this.values[1] * vec.x + this.values[5] * vec.y;
        this.values[14] = this.values[14] + this.values[2] * vec.x + this.values[6] * vec.y;
        this.values[15] = this.values[15] + this.values[3] * vec.x + this.values[7] * vec.y;
    }
    multiplied(other, dest) {
        let a00 = this.values[0], a01 = this.values[1], a02 = this.values[2], a03 = this.values[3];
        let a10 = this.values[4], a11 = this.values[5], a12 = this.values[6], a13 = this.values[7];
        let a20 = this.values[8], a21 = this.values[9], a22 = this.values[10], a23 = this.values[11];
        let a30 = this.values[12], a31 = this.values[13], a32 = this.values[14], a33 = this.values[15];
        let b0 = other.values[0], b1 = other.values[1], b2 = other.values[2], b3 = other.values[3];
        dest.values[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        dest.values[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        dest.values[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        dest.values[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = other.values[4];
        b1 = other.values[5];
        b2 = other.values[6];
        b3 = other.values[7];
        dest.values[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        dest.values[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        dest.values[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        dest.values[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = other.values[8];
        b1 = other.values[9];
        b2 = other.values[10];
        b3 = other.values[11];
        dest.values[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        dest.values[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        dest.values[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        dest.values[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = other.values[12];
        b1 = other.values[13];
        b2 = other.values[14];
        b3 = other.values[15];
        dest.values[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        dest.values[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        dest.values[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        dest.values[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    }
}
