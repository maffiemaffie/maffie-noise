/** utils */
/**
 * log 2
 * @param {Number} n n
 * @returns {Number} log 2
 */
const log2 = n => {
    if (n === 1)
        return 0;
    return 1 + log2(n >> 1);
};
/**
 * Gets all the bits in a given number
 * @param {Number} n binary number
 * @param {Number} length number of digits in n
 * @returns {Number[]} an array of every bit in n
 */
const getBits = (n, length) => {
    const ret = [];
    for (let i = 0; i < length; i++, n >>= 1)
        ret[i] = n & 1;
    return ret;
};
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
};
/**
 * v1 • v2
 * @param {Number[]} v1 vector
 * @param {Number[]} v2 vector
 * @returns v1 • v2
 */
const dot = (v1, v2) => {
    if (v1.length !== v2.length)
        throw 'DIE DIE DIE DIE DIE';
    return v1.reduce((sum, val, i) => sum + val * v2[i], 0);
};
/**
 * fills a binary number with 1's
 * @param {Number} n number of bits to fill
 * @returns {Number} n 1's
 */
const _fill = n => {
    return (1 << n) - 1;
};
export { log2, getBits, _xnor, dot, _fill };
