import { Noise } from "./Noise.js";

export class OctaveNoise {
    constructor(dim, depth, detail) {
        let octaves = [];
        for (let i = 0; i < detail; i++) {
            octaves.push(new Noise(dim, depth));
        }
        this.octaves = octaves;
        this.dim = dim;
    }

    get(...coords) {
        let sum = this.octaves.reduce((total, octave, i) => {
            const thisCoords = coords.map(c => c * (1 << i));
            return total + (this.octaves.length - i) * (this.octaves.length - i) * octave.get(...thisCoords);
        }, 0);

        const n = this.octaves.length;
        sum /= n * (n + 1) * (2 * n + 1) / 6;

        return sum;
    }

    gradient(...coords) {
        const emptyArr = [];
        for (let i = 0; i < this.dim; i++, emptyArr.push(0));

        let sum = this.octaves.reduce((total, octave, i) => {
            const thisCoords = coords.map(c => c * (1 << i));
            
            const multiplier = (this.octaves.length - i) * (this.octaves.length - i);
            const thisGradient = octave.gradient(...thisCoords);

            return total.map((x, i) => x + multiplier * thisGradient[i]);
        }, emptyArr);

        const n = this.octaves.length;
        const divisor = n * (n + 1) * (2 * n + 1) / 6;
        sum = sum.map(x => x / divisor);

        return sum;
    }
}