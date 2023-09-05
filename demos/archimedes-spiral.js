let canvas;
let ctx;

let canvasCenterX = 0;
let canvasCenterY = 0;

// r = a + b * theta
// polar -> cartesian coordinates
// x = r * cos(theta), y = r * sin(theta)

let loops = 3;
let a = 0;
let b = 20;
let resolution = 0.1;

const drawSpiral = () => {
    ctx.strokeStyle = "rgba(255, 0, 0, 1)";
    ctx.beginPath();
    let theta = loops * 2 * Math.PI;
    let previousStepX = 0;
    let previousStepY = 0;
    for (let step = 0; step < theta; step += resolution) {
        const r = a + b * step;
        const x = r * Math.cos(step);
        const y = r * Math.sin(step);
        ctx.lineTo(previousStepX + canvasCenterX, previousStepY + canvasCenterY, x + canvasCenterX, y + canvasCenterY);
        previousStepX = x;
        previousStepY = y;
    }
    ctx.stroke();
};

const drawScene = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSpiral();
};

class FpsCounter {
    #_fps = 0;

    constructor() {
        this.startTime = 0;
        this.#_fps = 0;
        this.fps = 0;
        window.requestAnimationFrame(this.update.bind(this));
    }

    update(elapsedTime) {
        if (this.startTime == 0) {
            this.startTime = elapsedTime;
        }
        if (elapsedTime - this.startTime >= 1000) {
            this.startTime = elapsedTime;
            this.fps = this.#_fps;
            this.#_fps = 0;
        } else {
            this.#_fps += 1;
        }

        window.requestAnimationFrame(this.update.bind(this));
    };
}

const counter = new FpsCounter();

const easeInOutQuad = (x) => {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

const lerp = (start, end, amt) => {
    return (1 - amt) * start + amt * end
};


const flip = (t) => {
    return 1 - t;
};

const eastInOutQuadReversed = (t) => {
    const r = easeInOutQuad(t);
    return lerp(r, flip(r), t);
};

let startTime;

const animate = (timestamp) => {
    if (startTime == undefined) {
        startTime = timestamp;
    }
    const elapsedTime = timestamp - startTime;
    const duration = 4 * 1000;
    const minDistance = 1;
    const maxDistance = 3;
    b = lerp(minDistance, maxDistance, eastInOutQuadReversed(elapsedTime / duration));
    drawScene();
    if (elapsedTime >= duration) {
        startTime = timestamp
    }
    window.requestAnimationFrame(animate);
};

const hypnotize = () => {
    loops = 100;
    window.requestAnimationFrame(animate);
};

const updateLabels = () => {
    const centerPointLabelElement = document.getElementById("centerpoint-label");
    centerPointLabelElement.innerText = a;

    const loopDistanceLabelElement = document.getElementById("loop-distance-label");
    loopDistanceLabelElement.innerText = b;

    const loopsCountLabelElement = document.getElementById("loops-count-label");
    loopsCountLabelElement.innerText = loops;

    const resolutionLabelElement = document.getElementById("resolution-label");
    resolutionLabelElement.innerText = resolution;
};

const onChanges = () => {
    drawScene();
    updateLabels();
};

const listenToInputChanges = () => {
    const aSliderElement = document.getElementById("a");
    aSliderElement.addEventListener("input", (ev) => {
        a = parseFloat(aSliderElement.value);
        onChanges();
    });

    const bSliderElement = document.getElementById("b");
    bSliderElement.addEventListener("input", (ev) => {
        b = parseInt(bSliderElement.value);
        onChanges();
    });

    const loopsSliderElement = document.getElementById("loops");
    loopsSliderElement.addEventListener("input", (ev) => {
        loops = parseInt(loopsSliderElement.value);
        onChanges();
    });

    const resolutionSliderElement = document.getElementById("resolution");
    resolutionSliderElement.addEventListener("input", (ev) => {
        resolution = parseFloat(resolutionSliderElement.value);
        onChanges();
    });

    const hypnotizeButtonElement = document.getElementById("hypnotize");
    hypnotizeButtonElement.addEventListener("click", (ev) => {
        hypnotize();
    });
};

window.onload = () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    canvasCenterX = canvas.width / 2;
    canvasCenterY = canvas.height / 2;

    listenToInputChanges();
    onChanges();
}
