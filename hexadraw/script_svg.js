const hexGrid = document.getElementById('hexGrid');
const colorPicker = document.getElementById('colorPicker');

const hexRadius = 20;
const hexHeight = Math.sqrt(3) * hexRadius;
const hexWidth = 2 * hexRadius;
const hexVerticalSpacing = hexHeight;
const hexHorizontalSpacing = hexWidth * 3/4;

function drawHexagon(x, y) {
    const hexagon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    const points = [];
    for (let i = 0; i < 6; i++) {
        const angle = Math.PI / 3 * i;
        const pointX = x + hexRadius * Math.cos(angle);
        const pointY = y + hexRadius * Math.sin(angle);
        points.push(`${pointX},${pointY}`);
    }
    hexagon.setAttribute("points", points.join(" "));
    hexagon.setAttribute("stroke", "black");
    hexagon.setAttribute("stroke-width", "1");
    hexagon.setAttribute("fill", "white");
    hexagon.addEventListener('click', function() {
        hexagon.setAttribute("fill", colorPicker.value);
    });
    hexGrid.appendChild(hexagon);
}

for (let y = 0, row = 0; y + hexHeight / 2 < hexGrid.getAttribute("height"); y += hexVerticalSpacing * 0.75, row++) {
    const xOffset = (row % 2) * hexHorizontalSpacing / 2;
    for (let x = 0; x + hexWidth / 2 - xOffset < hexGrid.getAttribute("width"); x += hexHorizontalSpacing) {
        drawHexagon(x + xOffset + hexRadius, y + hexRadius);
    }
}
