const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const a = 2 * Math.PI / 6;
const sqrt3 = Math.sqrt(3);
const hex_size = 5;

let cameraX = 0;
let cameraY = 0;

let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let cameraStartX = 0;
let cameraStartY = 0;

let randomGenerator = new MersenneTwister();
//const gradients = [{x: 1, y: 0}, {x: -1, y: 0}, {x: 0, y: 1}, {x: 0, y: -1}];
const gradients = [{x: 1, y: 0}, {x: -1, y: 0}, {x: 0, y: 1}, {x: 0, y: -1},
                   {x: Math.cos(Math.PI/4),  y: Math.cos(Math.PI/4)},
                   {x: -Math.cos(Math.PI/4), y: Math.cos(Math.PI/4)},
                   {x: Math.cos(Math.PI/4),  y: -Math.cos(Math.PI/4)},
                   {x: -Math.cos(Math.PI/4), y: -Math.cos(Math.PI/4)},
                  ];
const permutation_size = 256;
const permutation = generatePermutation(permutation_size);

function init() {
    canvas.width = window.innerWidth - 2 * parseInt(window.getComputedStyle(document.body).getPropertyValue('margin-left'));
    canvas.height = window.innerHeight - 2 * parseInt(window.getComputedStyle(document.body).getPropertyValue('margin-top'));

    console.log("PRNG seed: " + randomGenerator.seed);

    drawGrid();
}
init();

function shuffle(array) {
    let currentIndex = array.length;
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        let randomIndex = Math.floor(randomGenerator.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] =
            [array[randomIndex], array[currentIndex]];
    }
}

function generatePermutation(size) {
    let a = Array.from(Array(size).keys());
    shuffle(a);
    return a.concat(a);
}

function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function mod(n, m) {
    return ((n % m) + m) % m;
}

function getGradient(x, y) {
    return gradients[permutation[permutation[mod(x, permutation_size)] + mod(y, permutation_size)] % gradients.length];
}

function dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
}

function getNoise(p) {
    const p0 = {x: Math.floor(p.x), y: Math.floor(p.y)};
    const p1 = {x: p0.x + 1,      y: p0.y};
    const p2 = {x: p0.x,          y: p0.y + 1};
    const p3 = {x: p0.x + 1,      y: p0.y + 1};

    const g0 = getGradient(p0.x, p0.y);
    const g1 = getGradient(p1.x, p1.y);
    const g2 = getGradient(p2.x, p2.y);
    const g3 = getGradient(p3.x, p3.y);

    const fade_x = fade(p.x - p0.x);
    const fade_y = fade(p.y - p0.y);

    const p0p1 = (1 - fade_x) * dot(g0, {x: p.x-p0.x, y: p.y-p0.y}) +
          fade_x * dot(g1, {x: p.x-p1.x, y: p.y-p1.y});
    const p2p3 = (1 - fade_x) * dot(g2, {x: p.x-p2.x, y: p.y-p2.y}) +
          fade_x * dot(g3, {x: p.x-p3.x, y: p.y-p3.y});

    return (1 - fade_y) * p0p1 + fade_y * p2p3;
}

function getColor(x, y) {
    var freq = 750;
    const octaves = 6;

    let noise = 0;
    for (var i = 0; i < octaves; i++) {
        noise += 1/(2 ** i) * getNoise({x: (x+100)/freq, y: y/freq});
        freq /= 2;
    }
    
    if (noise < 0.2) return `rgb(0, 0, ${128})`;
    if (noise < 0.25) return `rgb(64, 64, ${128})`;
    if (noise < 0.27) return `rgb(128, 128, 0)`;
    if (noise < 0.5) return `rgb(0, ${126}, 0)`;
    if (noise < 0.75) return `rgb(128, ${126}, 128)`;
    return `rgb(${192}, ${192}, ${192})`;
}

// todo: should drawHexagon take only q and r as arguments?
function drawHexagon(centerX, centerY, q, r) {
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
        ctx.lineTo(centerX + hex_size * Math.sin(a * i), centerY + hex_size * Math.cos(a * i));
    }
    ctx.closePath();
    const { x: cx, y: cy } = axialToPixel(q, r);
    ctx.fillStyle = getColor(cx, cy);
    if (q == 0 && r == 0) ctx.fillStyle = `rgb(168, 0, 0)`;
    ctx.fill();

    // ctx.fillStyle = "black";
    // ctx.font = "bold 16px Arial";
    // ctx.textAlign = 'center';
    // ctx.textBaseline = 'middle';
    // ctx.fillText(q+" "+r, centerX, centerY);
}

function axialToPixel(q, r) {
    // pointy-topped layout
    // x = sqrt(3) * (q + r/2) * HEX_SIZE
    // y = (3/2) * r * HEX_SIZE
    const x = sqrt3 * (q + r/2) * hex_size;
    const y = (3/2) * r * hex_size;
    return { x, y };
}

function pixelToAxial(x, y) {
    // For pointy-topped layout:
    // q = ( (sqrt(3)/3)*x - (1/3)*y ) / HEX_SIZE
    // r = ( (2/3)*y ) / HEX_SIZE
    const q = ((sqrt3 * x - y) / 3) / hex_size;
    const r = ((2/3) * y) / hex_size;
    return { q, r };
}

function axialDistance(q1, r1, q2, r2) {
    // distance = (|q1-q2| + |(q1 + r1) - (q2 + r2)| + |r1-r2|) / 2
    const dq = Math.abs(q1 - q2);
    const dr = Math.abs(r1 - r2);
    const dqr = Math.abs((q1 + r1) - (q2 + r2));
    return (dq + dqr + dr) / 2;
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    // in "camera space", the corners are at:
    const left = cameraX - canvasWidth / 2;
    const right = cameraX + canvasWidth / 2;
    const top = cameraY - canvasHeight / 2;
    const bottom = cameraY + canvasHeight / 2;
    // Convert these corners to approximate axial coords
    const topLeft    = pixelToAxial(left,  top);
    const topRight   = pixelToAxial(right, top);
    const bottomLeft = pixelToAxial(left,  bottom);
    const bottomRight= pixelToAxial(right, bottom);
    // Boundaries in axial coords with some margin so we don’t see gaps.
    let minQ = Math.floor(Math.min(topLeft.q, topRight.q, bottomLeft.q, bottomRight.q)) - 1;
    let maxQ = Math.ceil(Math.max(topLeft.q, topRight.q, bottomLeft.q, bottomRight.q)) + 1;
    let minR = Math.floor(Math.min(topLeft.r, topRight.r, bottomLeft.r, bottomRight.r)) - 1;
    let maxR = Math.ceil(Math.max(topLeft.r, topRight.r, bottomLeft.r, bottomRight.r)) + 1;

    for (let q = minQ; q <= maxQ; q++) {
        for (let r = minR; r <= maxR; r++) {
            // Get center of this hex in pixel coords
            const { x: cx, y: cy } = axialToPixel(q, r);
            // Shift by camera offset so it lands in the correct place on the screen
            const screenX = cx - cameraX + canvasWidth/2;
            const screenY = cy - cameraY + canvasHeight/2;
            // Optional culling if the hex center is well outside the view
            if (screenX < -hex_size || screenX > canvasWidth + hex_size ||
                screenY < -hex_size || screenY > canvasHeight + hex_size) {
                continue;
            }
            // Build the hex polygon
            drawHexagon(screenX, screenY, q, r);
        }
    }
}

function dragStart(e) {
    isDragging = true;
    dragStartX = e.pageX;
    dragStartY = e.pageY;
    cameraStartX = cameraX;
    cameraStartY = cameraY;
}
function dragMove(e) {
    if (!isDragging) return;
    const dx = e.pageX - dragStartX;
    const dy = e.pageY - dragStartY;
    cameraX = cameraStartX - dx; 
    cameraY = cameraStartY - dy;
    drawGrid();
}
function dragEnd(e) {
    isDragging = false;
}

function touchStart(e) { dragStart(e.touches[0]); }
function touchMove(e) { dragMove(e.touches[0]); e.preventDefault(); }
function touchEnd(e) { dragEnd(e.changedTouches[0]); }

canvas.addEventListener('touchstart', touchStart, false);
canvas.addEventListener('touchmove', touchMove, false);
canvas.addEventListener('touchend', touchEnd, false);

canvas.addEventListener('mousedown', dragStart, false);
canvas.addEventListener('mousemove', dragMove, false);
canvas.addEventListener('mouseup', dragEnd, false);
