//setting
const H = 3;
const W = 3;
const L = 40;
const T = 6;

//grid
const dx = [1, 0, -1, 0];
const dy = [0, 1, 0, -1];

//state
//choice
let b = new Array(H);
for (let i = 0; i < H; ++i) b[i] = new Array(W);
//path
let p = new Array();

//canvas
canvas.height = H * L;
canvas.width = W * L;
const ctx = canvas.getContext("2d");
ctx.fillStyle = "rgba(" + [0, 0, 0, 0.5] + ")";
ctx.lineWidth = T;

//script
draw();
p.push([0, 0], [1, 0], [1, 1], [1, 2], [2, 2]);
drawPath();

//draw
function draw() {
  for (let i = 0; i < H; ++i) for (let j = 0; j < W; ++j) drawCell(i, j);
  drawPath();
}
function drawCell(i, j) {
  ctx.clearRect(j * L, i * L, L, L);
  ctx.strokeStyle = "black";
  ctx.strokeRect(j * L, i * L, L, L);
  if (b[i][j]) ctx.fillRect(j * L, i * L, L, L);
}
function drawPath() {
  let N = p.length;
  for (let i = 0; i < N - 1; ++i) {
    ctx.strokeStyle = color(i * 0.05);
    ctx.beginPath();
    ctx.moveTo(p[i][1] * L + L / 2, p[i][0] * L + L / 2);
    ctx.lineTo(p[i + 1][1] * L + L / 2, p[i + 1][0] * L + L / 2);
    ctx.stroke();
  }
}
function color(h) {
  let x, y, z;
  // h *= 2 / 3; //blue
  h *= 3 / 4; //violet
  // h *= 19 / 24; //purple
  // h *= 5 / 6; //magenta
  if (h < 1 / 6) {
    x = 1;
    y = h * 6;
    z = 0;
  } else if (h < 2 / 6) {
    x = (1 / 3 - h) * 6;
    y = 1;
    z = 0;
  } else if (h < 3 / 6) {
    x = 0;
    y = 1;
    z = (h - 1 / 3) * 6;
  } else if (h < 4 / 6) {
    x = 0;
    y = (2 / 3 - h) * 6;
    z = 1;
  } else if (h < 5 / 6) {
    x = (h - 2 / 3) * 6;
    y = 0;
    z = 1;
  } else {
    x = 1;
    y = 0;
    z = (1 - h) * 6;
  }
  return "rgb(" + [x * 255, y * 255, z * 255] + ")";
}
