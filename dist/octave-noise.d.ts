export class OctaveNoise {
    constructor(dim: any, depth: any, detail: any);
    octaves: Noise[];
    dim: any;
    get(...coords: any[]): number;
    gradient(...coords: any[]): number[];
}
import { Noise } from "./noise.js";
