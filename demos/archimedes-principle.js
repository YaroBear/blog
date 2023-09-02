// A sphere is really just a three dimensional circle. We can solve for a "submerged" circle
// to get a good illustration of Archimedes' principle.
// i.e. Ratio of volume submerged == ratio of circle submerged
const densityWater = 997;
const gravity = 9.81;
let densityBall;
let radiusCircle = 50; // cm, in this case our units are actual pixels
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

const drawWater = () => {
    ctx.fillStyle = "rgba(0, 0, 255, .6)";
    ctx.fillRect(0, canvas.height, canvas.width, canvas.height / -2);
};

const drawCircle = () => {
    const diskSagittaLength = calculateDiskSagittaLength();
    const ballCenterX = canvas.width / 2;
    const ballCenterY = canvas.height / 2 - radiusCircle + diskSagittaLength;
    ctx.fillStyle = "rgba(255, 0, 0, 1)";
    ctx.beginPath();
    ctx.arc(ballCenterX, ballCenterY, radiusCircle, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
};

const drawGeometryOverlayConditionally = () => {
    const showGeometryOverlayCheckbox = document.getElementById('show-geometry-overlay');
    if (!showGeometryOverlayCheckbox.checked) {
        return
    }

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

const updateGeometryOverlay = () => {
    const diskSagittaLength = calculateDiskSagittaLength();
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

    const triangleBaseLength = radiusCircle * Math.sin(sectorAngle / 2);
    const d = radiusCircle * Math.cos(sectorAngle / 2);

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
    const sagittaLength = radiusCircle - radiusCircle * Math.cos(sectorAngle / 2);
    return sagittaLength;
};

const updateDensityOfBall = () => {
    const densityBallElement = document.getElementById("density-ball");
    densityBall = massBall / calculateBallVolume();
    densityBallElement.innerText = parseFloat(densityBall).toFixed(2);
};

const updateVolumeWaterDisplaced = () => {
    const volumeWaterDisplacedElement = document.getElementById("volume-water-displaced");
    volumeWaterDisplacedElement.innerText = parseFloat(calculateBallVolume() * calculatePercentageSubmerged()).toFixed(4);
};

const updateBuoyantForce = () => {
    const buoyantForceElement = document.getElementById("buoyant-force");
    buoyantForceElement.innerText = parseFloat(calculateBuoyantForce()).toFixed(2);
};

const updateCircleMass = (massSliderValue) => {
    const ballMassLabelElement = document.getElementById("ball-mass-label");
    massBall = massSliderValue;
    ballMassLabelElement.innerText = massBall;
};

const updateCircleRadius = (radiusSliderValue) => {
    const ballRadiusLabel = document.getElementById("ball-radius-label");
    radiusCircle = radiusSliderValue;
    ballRadiusLabel.innerText = radiusCircle;
};

const calculateBallVolume = () => {
    return ((4 / 3) * Math.PI * (radiusCircle / 100) ** 3);
}

const calculateBuoyantForce = () => {
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
    drawCircle();
    drawWater();
    drawGeometryOverlayConditionally();
};

const onChanges = () => {
    updateDensityOfBall();
    updateVolumeWaterDisplaced();
    updateBuoyantForce();
    updateGeometryOverlay();
    drawScene();
    conditionallyShowBuoyancyNote();
};

const listenToInputChanges = () => {
    const ballMassSliderElement = document.getElementById("ball-mass");
    ballMassSliderElement.addEventListener("input", (ev) => {
        updateCircleMass(ballMassSliderElement.value);
        onChanges();
    });

    const ballRadiusSlider = document.getElementById("ball-radius");
    ballRadiusSlider.addEventListener("input", (ev) => {
        updateCircleRadius(ballRadiusSlider.value)
        onChanges();
    });

    const showGeometryOverlayCheckbox = document.getElementById('show-geometry-overlay');
    showGeometryOverlayCheckbox.addEventListener("input", (ev) => {
        onChanges();
    });
};

window.onload = () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    listenToInputChanges();
    onChanges();
}
