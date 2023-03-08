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
 * Gets the location of each 1 in a binary sequence
 * @param {Number} n binary number
 * @returns {Number[]} the indices of each 1
 */
const _extractOnes = n => {
    const _extractRecurse = (n, i) => {
        if (!n) return [];
        return [...(n & 1 ? [i] : []), ..._extractRecurse(n >> 1, i + 1)];
    }
    return _extractRecurse(n, 0);
}

/**
 * Gets the bit at the positionth place
 * @param {Number} n binary number
 * @param {Number} position place
 * @returns the bit
 */
const getBitAt = (n, position) => (n >> position) & 1;

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
 * matrix multiplication
 * @param {Number[][]} m1 m x n left-hand matrix
 * @param {Number[][]} m2 n x p right-hand matrix
 * @returns {Number[][]} m1 x m2
 */
const mult = (m1, m2) => {
    if (m1[0].length !== m2.length) throw 'DIE DIE DIE DIE DIE';
    
    let ret = [];

    for (let i = 0; i < m1.length; i++) {
        ret[i] = [];
        for (let j = 0; j < m2[0].length; j++) {
            ret[i][j] = 0;
            for (let k = 0; k < m2.length; k++) {
                ret[i][j] += m1[i][k] * m2[k][j];
            }
        }
    }
    return ret;
}

/**
 * fills a binary number with 1's
 * @param {Number} n number of bits to fill
 * @returns {Number} n 1's
 */
const _fill = n => {
    return (1 << n) - 1;
}

export {
    log2,
    getBitAt,
    getBits,
    _extractOnes,
    _xnor,
    dot,
    mult,
    _fill,
}
