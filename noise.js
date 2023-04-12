export class Noise {
    constructor(dim, depth) {
        this.dim = dim; // n dimension in Rn space
        this.pow = depth; // resolution power
        this.res = 1 << depth; // tile size

        this.merp = new Merp(dim); // interpolator
        this.gradientMerp = new Merp(dim - 1)
        this.values = this._init(); // randomize lattice points
    }

    /**
     * Randomize lattice points
     * @returns an Array of randomized values
     */
    _init() {
        let ret = [];
        // tile size ^ dimension
        for (let i = 0; i < 1 << this.pow * this.dim; i++) {
            ret.push(Math.random());
        }
        return ret;
    }

    /**
     * Gets the 2^n lattice points surrounding a given point
     * @param  {...Number} coords x0, x1, ..., xn-1 coordinates of a given point
     * @returns {Number[][]} the surrounding points
     */
    _getBounds(...coords) {
        let axes = [];
        for(let i = 0; i < this.dim; i++) {
            axes.push([Math.floor(coords[i]), Math.floor(coords[i]) + 1]);
        }

        let points = [];
        // construct each point (run through every combination of 2n axes)
        for (let vert = 0; vert < 1 << this.dim; vert++) {
            const pointCoords = getBits(vert, this.dim);

            const point = [];
            pointCoords.forEach((bit, i) => {
                point.push(axes[i][bit]); // [x0, x1, ..., xn-1 axis][each side]
            });

            points.push(point);
        }

        return points;
    }

    /**
     * Gets the interpolated value at a given point
     * @param  {...Number} coords x0, x1, ..., xn-1 coordinates of a given point
     * @returns {Number} the value
     */
    get(...coords) {
        const mask = _fill(this.pow);
        let points = this._getBounds(...coords); // boundary points
        let dists = coords.map((p, i) => p - points[0][i]); // d0, d1, ..., dn distances
        dists = dists.map(d => this._mapDecimal(this._smooth(d), -1, 1)); // smoothstep, map [-1, 1]

        let values = points.map(p => p.map(c => c & mask)); // modulo point
        values = values.map(p => this._getPoint(...p)); // get value at point

        return this.merp.merp({'values': values, 'distances': dists});
    }

    /**
     * Gets the interpolated gradient at a given point
     * @param  {...Number} coords x0, x1, ..., xn-1 coordinates of a given point
     * @returns {Number[]} x0, x1, ..., xn-1 gradient vector
     */
    gradient(...coords) {
        const mask = _fill(this.pow);

        let points = this._getBounds(...coords); // boundary points
        let values = points.map(p => p.map(c => c & mask)); // modulo point
        values = values.map(p => this._getPoint(...p)); // get value at point

        let dists = coords.map((x, i) => x - points[0][i]); // D0, D1, ..., Dn distances
        let ds_dx = dists.map(d => this._smoothDx(d));
        dists = dists.map(d => this._mapDecimal(d, -1, 1)); // smoothstep, map [-1, 1]
        let ret = [];

        // x0, x1, ..., xn-1
        for (let x = 0; x < this.dim; x++) {
            let boundHigh = [];
            let boundLow = [];

            for (let p = 0; p < points.length >> 1; p++) {
                boundHigh.push((p >> x << x) + p + (1 << x));
                boundLow.push( (p >> x << x) + p);
            }
            const difference = boundHigh.map((b, i) => values[b] - values[boundLow[i]]);
            const thisDists = dists.filter((_, i) => i !== x);

            ret.push(ds_dx[x] * this.gradientMerp.merp({'values': difference, 'distances': thisDists}));
        }

        return ret;
    }

    /**
     * Returns the value at a given lattice point
     * @param  {...Number} coords x0, x1, ..., xn coordinates of a given point
     * @returns {Number} the lattice value
     */
    _getPoint(...coords) {
        return this.values[this._toIndex(...coords)];
    }

    /**
     * Flattens the n coordinates to a 1D index coordinate
     * @param  {...Number} coords x0, x1, ..., xn coordinates of a given point
     * @returns {Number} the index
     */
    _toIndex(...coords) {
        // FUCK YOU RECURSION WRAPPERS I HATE YOU I HATE YOU I HATE YOU
        const _toIndexRecurse = (n, ...coords) => {
            if (coords.length === 0) return 0;
            return (coords[0] << n) + _toIndexRecurse(n + this.pow, ...(coords.slice(1)));
        }
        // but alas, i have to use you 😔
        return _toIndexRecurse(0, ...coords);
    }

    /**
     * Converts an index coordinate into coordinates in Rn
     * @param {Number} index the 1D index coordinate
     * @returns {Number[]} [x0, x1, ..., xn] n dimensional coordinates
     */
    _toCoords(index) {
        const mask = _fill(this.pow);
        let ret = [];
        for (let i = 0; i < this.dim; i++, index >>= this.pow) ret.push(index & mask);
        return ret;
    }

    /**
     * Remaps a value to a specified range, from [0, 1]
     * @param {Number} value value to be mapped [0, 1]
     * @param {Number} toMin new minimum
     * @param {Number} toMax new maximum
     * @returns {Number} value mapped to new range
     */
    _mapDecimal(value, toMin, toMax) {
        return value * toMax + (1 - value) * toMin;
    }

    /**
     * Smooths a value on [0, 1]
     * @param {Number} x value to be smoothed [0, 1]
     * @returns {Number} the smoothed value
     */
    _smooth(x) {
        // lol 6x^5 -15x^4 + 10x^3
        return x * x * x * (10 + x * (-15 + 6 * x));
    }

    _smoothDx(x) {
        // lol x^4 -2x^3 + x^2
        return 30 * x * x * (1 + x * (-2 + x));
    }


}

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

/** merp */
class Merp {
    constructor(dim) {
        const size = 1 << dim;
        this.scalar = 1 / (size);
        this.merpArrayN = [];
        for (let i = 0; i < size; i++) this.merpArrayN[i] = []; // init

        for (let i = 0; i < size; i++) {
            for(let j = 0; j < size; j++) {
                this.merpArrayN[i][j] = !!_xnor(...getBits(i | ~j, dim));
            }
        }
    }

    /**
     * Multilinear interpolation in any integer dimension
     * @param {Number[]} opts.values the values to be interpolated between
     * @param {Number[]} opts.distances the location of the point, relative to its closest boundary points
     * @returns {Number[]} interpolated result, formatted as a vector
     */
    merp({'values': vertices, 'distances': dists}) {
        const WEIGHT_PRODUCTS = this._getWeightProducts(...dists);

        const weights = []
        for (let m = 0; m < vertices.length; m++) {
            weights.push(this._signDot(this.merpArrayN[m], WEIGHT_PRODUCTS));
        }

        return this.scalar * dot(vertices, weights);
    }

    /**
     * Generates the weight column used by this.merp()
     * @param  {...any} dists the location of the point, relative to its closest boundary points
     * @returns {Number[]} weight column
     */
    _getWeightProducts(...dists){
        const _getWeightProductsRecurse = n => {
            if (n === -1) return [1];
            return [
                ..._getWeightProductsRecurse(n - 1),
                ..._getWeightProductsRecurse(n - 1).map(w => dists[n] * w)
            ];
        }
        return _getWeightProductsRecurse(dists.length - 1);
    }

    _signDot(s, v) {
        if (s.length !== v.length) throw 'DIE DIE DIE DIE DIE';
        return v.reduce((sum, val, i) => {
            if (s[i]) return sum + val;
            return sum - val;
        });
    }
    
}

/** utils */
/**
 * log 2
 * @param {Number} n n
 * @returns {Number} log 2
 */
const log2 = n => {
    if (n === 1) return 0;
    return 1 + log2(n >> 1);
}

/**
 * Gets all the bits in a given number
 * @param {Number} n binary number
 * @param {Number} length number of digits in n 
 * @returns {Number[]} an array of every bit in n
 */
const getBits = (n, length) => {
    const ret = [];
    for (let i = 0; i < length; i++, n >>= 1) ret[i] = n & 1;
    return ret;
}

/**
 * x0 xnor x1 xnor .... xnor xn
 * @param {...Number} bits bits
 * @returns {Boolean} xnor
 */
const _xnor = (...bits) => {
    // count the 0's
    const sum = bits.reduce((total, val) => total + (val ? 0 : 1), 0);
    // return true if the 0's form pairs
    return !(sum & 1);
}

/**
 * v1 • v2
 * @param {Number[]} v1 vector
 * @param {Number[]} v2 vector
 * @returns v1 • v2
 */
const dot = (v1, v2) => {
    if (v1.length !== v2.length) throw 'DIE DIE DIE DIE DIE';
    return v1.reduce((sum, val, i) => sum + val * v2[i], 0);
}

/**
 * fills a binary number with 1's
 * @param {Number} n number of bits to fill
 * @returns {Number} n 1's
 */
const _fill = n => {
    return (1 << n) - 1;
}