export class Noise {
    constructor(dim: any, depth: any);
    dim: any;
    pow: any;
    res: number;
    merp: Merp;
    gradientMerp: Merp;
    values: number[];
    /**
     * Randomize lattice points
     * @returns an Array of randomized values
     */
    _init(): number[];
    /**
     * Gets the 2^n lattice points surrounding a given point
     * @param  {...Number} coords x0, x1, ..., xn-1 coordinates of a given point
     * @returns {Number[][]} the surrounding points
     */
    _getBounds(...coords: number[]): number[][];
    /**
     * Gets the interpolated value at a given point
     * @param  {...Number} coords x0, x1, ..., xn-1 coordinates of a given point
     * @returns {Number} the value
     */
    get(...coords: number[]): number;
    /**
     * Gets the interpolated gradient at a given point
     * @param  {...Number} coords x0, x1, ..., xn-1 coordinates of a given point
     * @returns {Number[]} x0, x1, ..., xn-1 gradient vector
     */
    gradient(...coords: number[]): number[];
    /**
     * Returns the value at a given lattice point
     * @param  {...Number} coords x0, x1, ..., xn coordinates of a given point
     * @returns {Number} the lattice value
     */
    _getPoint(...coords: number[]): number;
    /**
     * Flattens the n coordinates to a 1D index coordinate
     * @param  {...Number} coords x0, x1, ..., xn coordinates of a given point
     * @returns {Number} the index
     */
    _toIndex(...coords: number[]): number;
    /**
     * Converts an index coordinate into coordinates in Rn
     * @param {Number} index the 1D index coordinate
     * @returns {Number[]} [x0, x1, ..., xn] n dimensional coordinates
     */
    _toCoords(index: number): number[];
    /**
     * Remaps a value to a specified range, from [0, 1]
     * @param {Number} value value to be mapped [0, 1]
     * @param {Number} toMin new minimum
     * @param {Number} toMax new maximum
     * @returns {Number} value mapped to new range
     */
    _mapDecimal(value: number, toMin: number, toMax: number): number;
    /**
     * Smooths a value on [0, 1]
     * @param {Number} x value to be smoothed [0, 1]
     * @returns {Number} the smoothed value
     */
    _smooth(x: number): number;
    _smoothDx(x: any): number;
}
import { Merp } from "./merp.js";
