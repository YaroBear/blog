// A sphere is really just a three dimensional circle. We can solve for a "submerged" circle
// to get a good illustration of Archimedes' principle.
// i.e. Ratio of volume submerged == ratio of circle submerged
const densityWater = 997;
const gravity = 9.81;
let densityBall;
let radiusBall = 50; // cm, in this case our units are actual pixels
let massBall = 10; // kg

let canvas;
let ctx;

const drawWater = (x, y, w, h) => {
    ctx.fillStyle = "rgba(0, 0, 255, .8)";
    ctx.fillRect(x, y, w, h);
};

const drawBall = (x, y) => {
    ctx.fillStyle = "rgba(255, 0, 0, 1)";
    ctx.beginPath();
    ctx.arc(x, y, radiusBall, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
};

const calculatePercentageSubmerged = () => {
    const percentageSubmerged = densityBall / densityWater;
    if (percentageSubmerged > 1) {
        return 1;
    }
    return percentageSubmerged;
};

const calculateDiskSagitta = () => {
    // sagitta: h = r - rcos(theta/2)
    // sector area/circle area = sector angle/circle angle
    // so, % area submerged = % circle angle
    const sectorAngle = calculatePercentageSubmerged() * 2 * Math.PI;
    const sagitta = radiusBall - radiusBall * Math.cos(sectorAngle/2);
    return sagitta;
};

const setDensityOfBall = () => {
    const densityBallElement = document.getElementById("density-ball");
    densityBall = massBall / calculateBallVolume();
    densityBallElement.innerText = parseFloat(densityBall).toFixed(2);
};

const setVolumeWaterDisplaced = () => {
    const volumeWaterDisplacedElement = document.getElementById("volume-water-displaced");
    volumeWaterDisplacedElement.innerText = parseFloat(calculateBallVolume() * calculatePercentageSubmerged()).toFixed(4);
};

const setBuoyantForce = () => {
    const buoyantForceElement = document.getElementById("buoyant-force");
    buoyantForceElement.innerText = parseFloat(getBuoyantForce()).toFixed(2);
};

const setMassBall = (massSliderValue) => {
    const ballMassLabelElement = document.getElementById("ball-mass-label");
    massBall = massSliderValue;
    ballMassLabelElement.innerText = massBall;
};

const setRadiusBall = (radiusSliderValue) => {
    const ballRadiusLabel = document.getElementById("ball-radius-label");
    radiusBall = radiusSliderValue;
    ballRadiusLabel.innerText = radiusBall;
};

const calculateBallVolume = () => {
    return ((4 / 3) * Math.PI * (radiusBall / 100) ** 3);
}

const getBuoyantForce = () => {
    // F = pgV
    return densityWater * gravity * calculateBallVolume() * calculatePercentageSubmerged();
}

const conditionallyShowBuoyancyNote = () => {
    if (calculatePercentageSubmerged() == 1) {
        const buoyancyNoteElement = document.getElementById("buoyancy-note");
        buoyancyNoteElement.style.visibility = "visible";
    }
}

const drawScene = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const diskSagitta = calculateDiskSagitta();
    drawBall(canvas.width / 2, canvas.height / 2 - radiusBall + diskSagitta);
    drawWater(0, canvas.height, canvas.width, canvas.height / -2);
};

const onChanges = () => {
    setDensityOfBall();
    setVolumeWaterDisplaced();
    setBuoyantForce();
    drawScene();
    conditionallyShowBuoyancyNote();
};

const listenToSliderChanges = () => {
    const ballMassSliderElement = document.getElementById("ball-mass");
    ballMassSliderElement.addEventListener("input", (ev) => {
        setMassBall(ballMassSliderElement.value);
        onChanges();
    });

    const ballRadiusSlider = document.getElementById("ball-radius");
    ballRadiusSlider.addEventListener("input", (ev) => {
        setRadiusBall(ballRadiusSlider.value)
        onChanges();
    });
};

window.onload = () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    listenToSliderChanges();
    onChanges();
}
