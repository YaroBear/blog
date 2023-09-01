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

let sectorAngle = 0;

let geometryOverlayParams = {
    'sagitta': {
        'points': [
            {
                'x': 0,
                'y': 0
            },
            {
                'x': 0,
                'y': 0
            }
        ]
    },
    'inscribedTriangle': {
        'points': [
            {
                'x': 0,
                'y': 0
            },
            {
                'x': 0,
                'y': 0
            },
            {
                'x': 0,
                'y': 0
            }
        ]
    }
}

const drawWater = (x, y, w, h) => {
    ctx.fillStyle = "rgba(0, 0, 255, .6)";
    ctx.fillRect(x, y, w, h);
};

const drawBall = (x, y) => {
    ctx.fillStyle = "rgba(255, 0, 0, 1)";
    ctx.beginPath();
    ctx.arc(x, y, radiusBall, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
};

const drawGeometryOverlay = () => {
    ctx.fillStyle = "rgba(0, 0, 0, 1)";

    const sagittaPoints = geometryOverlayParams['sagitta'].points;
    ctx.beginPath();
    ctx.moveTo(sagittaPoints[0].x, sagittaPoints[0].y);
    ctx.lineTo(sagittaPoints[1].x, sagittaPoints[1].y);
    ctx.stroke();

    const inscribedTrianglePoints = geometryOverlayParams['inscribedTriangle'].points;
    ctx.beginPath();
    ctx.moveTo(inscribedTrianglePoints[0].x, inscribedTrianglePoints[0].y);
    ctx.lineTo(inscribedTrianglePoints[1].x, inscribedTrianglePoints[1].y);
    ctx.lineTo(inscribedTrianglePoints[2].x, inscribedTrianglePoints[2].y);
    ctx.lineTo(inscribedTrianglePoints[0].x, inscribedTrianglePoints[0].y);
    ctx.stroke();

    ctx.font = "16px serif";
    ctx.fillText(`${(sectorAngle * 180 / Math.PI).toFixed(2)} °`, inscribedTrianglePoints[2].x, inscribedTrianglePoints[2].y);
}

const updateGeometryOverlaySagitta = (diskSagittaLength) => {
    const canvasCenterX = canvas.width / 2;
    const canvasCenterY = canvas.height / 2;
    geometryOverlayParams['sagitta'].points = [
        {
            x: canvasCenterX,
            y: canvasCenterY
        },
        {
            x: canvasCenterX,
            y: canvasCenterY + diskSagittaLength
        }
    ];
}

const updateGeometryOverlayInscribedAngle = () => {
    const canvasCenterX = canvas.width / 2;
    const canvasCenterY = canvas.height / 2;
    const triangleBaseLength = radiusBall * Math.sin(sectorAngle / 2);
    const d = radiusBall * Math.cos(sectorAngle / 2);

    geometryOverlayParams['inscribedTriangle'].points = [
        {
            x: canvasCenterX - triangleBaseLength,
            y: canvasCenterY
        },
        {
            x: canvasCenterX + triangleBaseLength,
            y: canvasCenterY
        },
        {
            x: canvasCenterX,
            y: canvasCenterY - d
        }
    ];
}

const calculatePercentageSubmerged = () => {
    const percentageSubmerged = densityBall / densityWater;
    if (percentageSubmerged > 1) {
        return 1;
    }
    return percentageSubmerged;
};

const calculateDiskSagittaLength = () => {
    // sagitta: h = r - rcos(theta/2)
    // sector area/circle area = sector angle/circle angle
    // so, % area submerged = % circle angle
    sectorAngle = calculatePercentageSubmerged() * 2 * Math.PI;
    const sagittaLength = radiusBall - radiusBall * Math.cos(sectorAngle / 2);
    return sagittaLength;
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
    const diskSagittaLength = calculateDiskSagittaLength();
    const ballCenterX = canvas.width / 2;
    const ballCenterY = canvas.height / 2 - radiusBall + diskSagittaLength;
    updateGeometryOverlaySagitta(diskSagittaLength);
    updateGeometryOverlayInscribedAngle();
    drawBall(ballCenterX, ballCenterY);
    drawWater(0, canvas.height, canvas.width, canvas.height / -2);
    drawGeometryOverlay();
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
