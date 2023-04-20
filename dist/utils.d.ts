/** utils */
/**
 * log 2
 * @param {Number} n n
 * @returns {Number} log 2
 */
export function log2(n: number): number;
/**
 * Gets all the bits in a given number
 * @param {Number} n binary number
 * @param {Number} length number of digits in n
 * @returns {Number[]} an array of every bit in n
 */
export function getBits(n: number, length: number): number[];
/**
 * x0 xnor x1 xnor .... xnor xn
 * @param {...Number} bits bits
 * @returns {Boolean} xnor
 */
export function _xnor(...bits: number[]): boolean;
/**
 * v1 • v2
 * @param {Number[]} v1 vector
 * @param {Number[]} v2 vector
 * @returns v1 • v2
 */
export function dot(v1: number[], v2: number[]): number;
/**
 * fills a binary number with 1's
 * @param {Number} n number of bits to fill
 * @returns {Number} n 1's
 */
export function _fill(n: number): number;
