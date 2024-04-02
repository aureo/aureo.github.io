const canvas = document.getElementById('hexCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');

const hexSize = 20;
const hexHeight = Math.sqrt(3) * hexSize;
const hexWidth = 2 * hexSize;

function drawHexagon(x, y, fill = false, color = null) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const pointX = x + hexSize * Math.cos(angle);
        const pointY = y + hexSize * Math.sin(angle);
        ctx.lineTo(pointX, pointY);
    }
    ctx.closePath();
    if (fill && color) {
        ctx.fillStyle = color;
        ctx.fill();
    } else {
        ctx.stroke();
    }
}

canvas.addEventListener('click', function(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Implement a more sophisticated point-in-polygon check here for hex fill
});

for (let y = 0, row = 0; y + hexHeight / 2 < canvas.height; y += hexHeight * 0.75, row++) {
    const xOffset = (row % 2) * hexWidth * 3/4 / 2;
    for (let x = 0; x + hexWidth / 2 - xOffset < canvas.width; x += hexWidth * 3/4) {
        drawHexagon(x + xOffset + hexSize, y + hexHeight / 2);
    }
}
