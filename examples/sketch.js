import { OctaveNoise } from "../../noise.js";

export class NoiseDemo {
   maffieNoise;
   SCALE = 20;
   NOISE_SCALE = 0.02;
   TIME_SCALE = 0.05;
   container;

   constructor(containerId) {
      this.container = containerId;
   }

   /**
    * Creates a new noise object and sets the styling.
    */
   setup() {
      let canvas = createCanvas(400, 400);
      canvas.parent(this.container);
      fill(0);
      strokeWeight(4);

      this.maffieNoise = new OctaveNoise(2, 5, 6);
   }

   /**
    * Draws the cirlces
    */
   draw() {
      background(0);

      for (let x = 0; x < width; x += this.SCALE) {
         const noiseVal = this.maffieNoise.get(x * this.NOISE_SCALE, frameCount * this.TIME_SCALE);

         for (let i = noiseVal * height; i < height; i += this.SCALE) {
            stroke(i, 0, 500 - i);
            circle(x + 0.5 * this.SCALE, i + 0.5 * this.SCALE, this.SCALE);
         }
      }
   }
}

