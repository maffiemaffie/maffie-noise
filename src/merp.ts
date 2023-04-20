import { getBits, _xnor, dot } from "./utils";

/** merp */
class Merp {
    private scalar:number;
    private merpArrayN:boolean[][];

    constructor(dim:number) {
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
     * Multilinear interpolation in any integer dimension.
     * @param {number[]} opts.values the values to be interpolated between
     * @param {number[]} opts.distances the location of the point, relative to its closest boundary points
     * @returns {number} interpolated result
     */
    merp(opts:{values:number[], distances:number[]}):number {
        const {values, distances} = opts;
        const WEIGHT_PRODUCTS:number[] = this._getWeightProducts(...distances);

        const weights:number[] = [];
        for (let m = 0; m < values.length; m++) {
            weights.push(this._signDot(this.merpArrayN[m], WEIGHT_PRODUCTS));
        }

        return this.scalar * dot(values, weights);
    }

    /**
     * Generates the weight column used by this.merp()
     * @param {...number[]} dists the location of the point, relative to its closest boundary points
     * @returns {number[]} weight column
     */
    _getWeightProducts(...dists:number[]):number[] {
        const _getWeightProductsRecurse = (n:number):number[] => {
            if (n === -1) return [1];
            return [
                ..._getWeightProductsRecurse(n - 1),
                ..._getWeightProductsRecurse(n - 1).map(w => dists[n] * w)
            ];
        }
        return _getWeightProductsRecurse(dists.length - 1);
    }

    /**
     * Computes the dot product of a boolean vector and a number vector as if the boolean represented 1's and -1's.
     * @param signedVector Represents a vector of 1's and -1's using true and false respectively.
     * @param numberVector Any vector of numbers.
     * @returns The dot product.
     */
    _signDot(signedVector:boolean[], numberVector:number[]):number {
        if (signedVector.length !== numberVector.length) throw 'DIE DIE DIE DIE DIE';
        return numberVector.reduce((sum:number, val:number, i:number):number => {
            if (signedVector[i]) return sum + val;
            return sum - val;
        });
    }
    
}

export { Merp };