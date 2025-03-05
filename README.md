# maffie-noise

Simple value noise library.
Let's you do cool noise stuff.

## Installation
Just import [index.js](index.js) as an ES6 module :thumbsup:

```js
import { Noise, OctaveNoise } from 'path/to/index.js';
```

## Getting Started
The module has two noise objects: Noise and OctaveNoise. OctaveNoise just stacks multiple Noise's on top of each other. I would recommend using that one. 

```js
import { OctaveNoise } from 'path/to/index.js';

const noise = new OctaveNoise(
    3, // dimensions
    4, // resolution
    4 // depth
);
```

Both objects have a method get() which returns the noise value at the specified point.
Below is a simple program implementing the Noise.get() method to generate a bumpy line.

```js
import { OctaveNoise } from "path/to/index.js";

const noise = new OctaveNoise(
    1, // dimensions
    4, // resolution
    3 // depth
);

// let's set up a basic canvas
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// we'll choose a couple constants for scaling
const NOISE_SCALE = 0.02;
const AMPLITUDE = canvas.height * 0.5;

// use our noise to generate a pseudo-random y-coordinate for each point
ctx.translate(0, canvas.height * 0.5);
ctx.beginPath();
for (let x = 1; x < canvas.width; x++) {
    ctx.moveTo(x - 1, AMPLITUDE * noise.get(NOISE_SCALE * (x - 1)));
    ctx.lineTo(x, AMPLITUDE * noise.get(NOISE_SCALE * x));
}
ctx.closePath();
ctx.stroke();
```

That's about it have fun thank you :3


## License
[MIT License](LICENSE).
