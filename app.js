const canvas = document.getElementById('bezier-canvas');
const ctx = canvas.getContext('2d');
const timeSlider = document.getElementById('time-slider');
const resetButton = document.getElementById('reset-button');
const timeLabel = document.getElementById('time-label');

let points = [];

function drawBezierCurve() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (points.length === 0) {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText('Click anywhere on canvas to place point', canvas.width / 2, canvas.height / 2);
        return;
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let t = 0; t <= 1; t += 0.01) {
        const redDot = calculateRedDotCoordinates(t);
        ctx.lineTo(redDot.x, redDot.y);
    }

    ctx.strokeStyle = "#007bff";
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.strokeStyle = "#fff";
    ctx.stroke();
    ctx.closePath();

    for (let i = 0; i < points.length; i++) {
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.closePath();
    }

    const currentTime = parseFloat(timeSlider.value);
    const redDot = calculateRedDotCoordinates(currentTime);

    ctx.beginPath();
    ctx.arc(redDot.x, redDot.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#ff6961";
    ctx.fill();
    ctx.closePath();

    for (let i = 0; i < points.length; i++) {
        ctx.font = '10px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(`(${points[i].x.toFixed(2)}, ${points[i].y.toFixed(2)})`, points[i].x, points[i].y - 10);
    }

    ctx.font = '10px Arial';
    ctx.fillStyle = '#ff6961';
    ctx.textAlign = 'center';
    ctx.fillText(`(${redDot.x.toFixed(2)}, ${redDot.y.toFixed(2)})`, redDot.x, redDot.y - 10);
}

function cubicBezier(t, p0, p1, p2, p3) {
    return Math.pow(1 - t, 3) * p0 + 3 * Math.pow(1 - t, 2) * t * p1 + 3 * (1 - t) * Math.pow(t, 2) * p2 + Math.pow(t, 3) * p3;
}

function calculateRedDotCoordinates(t) {
    const n = points.length - 1;
    let x = 0;
    let y = 0;

    for (let i = 0; i <= n; i++) {
        const binomialCoefficient = bc(n, i);
        const term = binomialCoefficient * Math.pow((1 - t), n - i) * Math.pow(t, i);
        x += term * points[i].x;
        y += term * points[i].y;
    }

    return {x, y};
}

function bc(n, k) {
    if (k < 0 || k > n) {
        return 0;
    }
    let result = 1;
    for (let i = 1; i <= Math.min(k, n - k); i++) {
        result *= n;
        result /= i;
        n--;
    }
    return result;
}

function updateCanvas() {
    drawBezierCurve();
    updateTimeLabel();
}

function updateTimeLabel() {
    const formattedTime = parseFloat(timeSlider.value).toFixed(2);
    timeLabel.textContent = `Time: ${formattedTime}`;
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const newPoint = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };

    points.push(newPoint);
    updateCanvas();
});

timeSlider.addEventListener('input', () => {
    updateCanvas();
});

resetButton.addEventListener('click', () => {
    points = [];
    updateCanvas();
});

window.addEventListener('resize', () => {
    canvas.width = Math.floor(window.innerWidth * 0.7);
    canvas.height = Math.floor(window.innerHeight * 0.7);
    updateCanvas();
});

window.dispatchEvent(new Event('resize'));