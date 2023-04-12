import { NoiseDemo } from "./sketch.js";

(() => {
    const demo = new NoiseDemo("noise-demo-container");
    window.setup = () => demo.setup();
    window.draw = () =>  demo.draw();

    const form = document.createElement('form')
    form.classList.add('m-control-panel');
    insertSlider(form, "scale-slider", "Scale", 5, 50, 0, 20);
    insertSlider(form, "noise-scale-slider", "Noise Scale", 0.0025, 0.05, 0.0025, 0.02);
    insertSlider(form, "time-scale-slider", "Time Scale", 0.01, 0.1, 0.01, 0.05);

    const container = document.querySelector("#noise-demo-container");
    container.insertAdjacentElement('beforeend', form);

    const scaleSlider = document.querySelector("#scale-slider");
    scaleSlider.addEventListener('input', e => {
        demo.SCALE = Number(e.target.value);
    });
    const noiseScaleSlider = document.querySelector("#noise-scale-slider");
    noiseScaleSlider.addEventListener('input', e => {
        demo.NOISE_SCALE = Number(e.target.value);
    });
    const timeScaleSlider = document.querySelector("#time-scale-slider");
    timeScaleSlider.addEventListener('input', e => {
        demo.TIME_SCALE = Number(e.target.value);
    });
})();

function insertSlider(container, id, label, min, max, step, value) {
    const slider = document.createElement('input');
    slider.setAttribute('type', 'range');
    slider.id = id;
    slider.classList.add('m-control__slider');
    slider.setAttribute('min', min);
    slider.setAttribute('max', max);
    slider.setAttribute('step', step);
    slider.setAttribute('value', value);

    const labelElem = document.createElement('label');
    const labelText = document.createTextNode(label);
    labelElem.appendChild(labelText);
    labelElem.classList.add('m-control__label');
    labelElem.setAttribute('for', id);

    container.insertAdjacentElement('beforeend', labelElem);
    container.insertAdjacentElement('beforeend', slider);
}