console.log("ver 0.6");

//setting
const H = 10;
const W = 10;
const L = 40;
const T = 6;

//grid
const dx = [1, 0, -1, 0];
const dy = [0, 1, 0, -1];
function rot(nx, ny) {
  return [
    [nx * nx, 0, ny],
    [0, ny * ny, -nx],
    [-ny, nx, 0],
  ];
}

//canvas
canvas.height = H * L;
canvas.width = W * L;
const ctx = canvas.getContext("2d");
ctx.fillStyle = "rgba(" + [0, 0, 0, 0.5] + ")";
ctx.lineWidth = T;

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

//state
let a = new Array(H);
let b = new Array(H);
for (let i = 0; i < H; ++i) {
  a[i] = new Array(W);
  b[i] = new Array(W);
}

//html
window.onload = set;
enterButton.onclick = judge;
clearButton.onclick = clear;

//path
let p = new Array();

//generate path
let x_min;
let y_min;
let x_max;
let y_max;
let visited;
function add(p) {
  const x = p[p.length - 1][0];
  const y = p[p.length - 1][1];
  let legal = [];
  for (let k = 0; k < 4; ++k) {
    const nx = x + dx[k];
    const ny = y + dy[k];

    if (
      nx - x_min >= H ||
      ny - y_min >= W ||
      x_max - nx >= H ||
      y_max - ny >= W
    )
      continue;
    if (visited[[nx, ny]]) continue;

    legal.push(k);
  }

  if (legal.length == 0) return false;

  const k = legal[Math.floor(Math.random() * legal.length)];
  const nx = x + dx[k];
  const ny = y + dy[k];

  visited[[nx, ny]] = true;
  p.push([nx, ny]);
  x_min = Math.min(x_min, x);
  y_min = Math.min(y_min, y);
  x_max = Math.max(x_max, x);
  y_max = Math.max(y_max, y);

  return true;
}
function genPath() {
  p.splice(0);
  p.push([0, 0]);
  x_min = 0;
  y_min = 0;
  x_max = 0;
  y_max = 0;
  visited = {};
  visited[[0, 0]] = true;

  while (add(p)) {}
  p = [...p].reverse();
  while (add(p)) {}

  p.forEach((e) => {
    e[0] -= x_min;
    e[1] -= y_min;
  });
}

//question
function set() {
  genPath();

  //make answer list
  for (let i = 0; i < H; ++i) a[i].fill(false);

  a[p[0][0]][p[0][1]] = true;
  let v = [0, 0, 1];
  let N = p.length;
  for (let i = 1; i < N; ++i) {
    const dx = p[i][0] - p[i - 1][0];
    const dy = p[i][1] - p[i - 1][1];
    const r = rot(-dy, dx);
    let nv = [0, 0, 0];
    for (let i = 0; i < 3; ++i)
      for (let j = 0; j < 3; ++j) nv[i] += r[i][j] * v[j];
    for (let i = 0; i < 3; ++i) v[i] = nv[i];

    if (v[2] == 1) a[p[i][0]][p[i][1]] = true;
  }
  clear();
}
function judge() {
  canvas.classList.remove("correct", "incorrect");
  canvas.offsetWidth;
  if (isCorrect()) {
    canvas.classList.add("correct");
    set();
  } else canvas.classList.add("incorrect");
}
function isCorrect() {
  for (let i = 0; i < H; ++i)
    for (let j = 0; j < W; ++j) if (b[i][j] != a[i][j]) return false;
  return true;
}

function clear() {
  for (let i = 0; i < H; ++i) b[i].fill(false);
  b[p[0][0]][p[0][1]] = true;
  draw();
}

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
    ctx.strokeStyle = color(i / (N - 2));
    ctx.beginPath();
    ctx.moveTo(p[i][1] * L + L / 2, p[i][0] * L + L / 2);
    ctx.lineTo(p[i + 1][1] * L + L / 2, p[i + 1][0] * L + L / 2);
    ctx.stroke();
  }
}

canvas.onclick = function (event) {
  const rct = canvas.getBoundingClientRect();
  let i = Math.floor(((event.pageY - rct.top) * H) / rct.height);
  let j = Math.floor(((event.pageX - rct.left) * W) / rct.width);
  toggle(i, j);
};
function toggle(i, j) {
  if (b[i][j]) {
    b[i][j] = false;
    ctx.clearRect(j * L, i * L, L, L);
    ctx.strokeStyle = "black";
    ctx.strokeRect(j * L, i * L, L, L);
  } else {
    b[i][j] = true;
    ctx.fillRect(j * L, i * L, L, L);
  }
  drawPath();
}
