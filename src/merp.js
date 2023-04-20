import { getBits, _xnor, dot } from "./utils.js";

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

export { Merp };