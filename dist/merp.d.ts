/** merp */
export class Merp {
    constructor(dim: any);
    scalar: number;
    merpArrayN: never[][];
    /**
     * Multilinear interpolation in any integer dimension
     * @param {Number[]} opts.values the values to be interpolated between
     * @param {Number[]} opts.distances the location of the point, relative to its closest boundary points
     * @returns {Number[]} interpolated result, formatted as a vector
     */
    merp({ "values": vertices, "distances": dists }: number[]): number[];
    /**
     * Generates the weight column used by this.merp()
     * @param  {...any} dists the location of the point, relative to its closest boundary points
     * @returns {Number[]} weight column
     */
    _getWeightProducts(...dists: any[]): number[];
    _signDot(s: any, v: any): any;
}
