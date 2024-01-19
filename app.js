const canvas = document.getElementById('bezier-canvas');
const ctx = canvas.getContext('2d');
const timeSlider = document.getElementById('time-slider');
const resetButton = document.getElementById('reset-button');
const timeLabel = document.getElementById('time-label');

let points = [];

function drawCubicBezierCurve() {
    if (points.length === 0) {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText('Click on canvas to add points', canvas.width / 2, canvas.height / 2);
        return;
    }

    for (let i = 0; i < points.length; i++) {
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.closePath();

        if (i > 0) {
            ctx.beginPath();
            ctx.moveTo(points[i - 1].x, points[i - 1].y);
            ctx.lineTo(points[i].x, points[i].y);
            ctx.strokeStyle = "#fff";
            ctx.stroke();
            ctx.closePath();
        }
        ctx.font = '10px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(`(${points[i].x.toFixed(2)}, ${points[i].y.toFixed(2)})`, points[i].x, points[i].y - 10);
    }

    if (points.length === 4) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        ctx.bezierCurveTo(points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y);
        ctx.strokeStyle = "#007bff";
        ctx.stroke();
        ctx.closePath();

        const t = parseFloat(timeSlider.value);
        const redDot = calculateRedDotCoordinates(t);

        ctx.beginPath();
        ctx.arc(redDot.x, redDot.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#ff6961";
        ctx.fill();
        ctx.closePath();

        ctx.font = '10px Arial';
        ctx.fillStyle = '#ff6961';
        ctx.textAlign = 'center';
        ctx.fillText(`(${redDot.x.toFixed(2)}, ${redDot.y.toFixed(2)})`, redDot.x, redDot.y - 10);
    }
}

function cubicBezier(t, p0, p1, p2, p3) {
    return Math.pow(1 - t, 3) * p0 + 3 * Math.pow(1 - t, 2) * t * p1 + 3 * (1 - t) * Math.pow(t, 2) * p2 + Math.pow(t, 3) * p3;
}

function calculateRedDotCoordinates(t) {
    return {
        x: cubicBezier(t, points[0].x, points[1].x, points[2].x, points[3].x),
        y: cubicBezier(t, points[0].y, points[1].y, points[2].y, points[3].y),
    };
}

function updateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCubicBezierCurve();
    updateTimeLabel();
}

function updateTimeLabel() {
    const formattedTime = parseFloat(timeSlider.value).toFixed(2);
    timeLabel.textContent = `Time: ${formattedTime}`;
}

canvas.addEventListener('click', (event) => {
    if (points.length < 4) {
        const rect = canvas.getBoundingClientRect();
        points.push({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        });
        updateCanvas();
    }
});

timeSlider.addEventListener('input', () => {
    updateCanvas();
});

resetButton.addEventListener('click', () => {
    points = [];
    updateCanvas();
});

window.addEventListener('resize', () => {
    canvas.width = Math.floor(window.innerWidth * 0.8);
    canvas.height = Math.floor(window.innerHeight * 0.8);
    updateCanvas();
});

window.dispatchEvent(new Event('resize'));
