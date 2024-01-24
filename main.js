//setting
const H = 10;
const W = 10;
const L = 40;
const T = 6;

//grid
const dx = [1, 0, -1, 0];
const dy = [0, 1, 0, -1];
function rot(k) {
  nx = -dy[k];
  ny = dx[k];
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
let c = new Array(H);
for (let i = 0; i < H; ++i) {
  a[i] = new Array(W);
  b[i] = new Array(W);
  c[i] = new Array(W);
  for (let j = 0; j < W; ++j) c[i][j] = new Array(4);
}

//html
window.onload = reset;
enterButton.onclick = confirmA;
clearButton.onclick = clear;

//question
let p = new Array();

function setQ() {
  //make path
  p.splice(0);

  let x = 0;
  let y = 0;
  let v = [0, 0, 1];

  let min_x = 0;
  let min_y = 0;
  let max_x = 0;
  let max_y = 0;

  let visited = {};
  visited[[0, 0]] = true;

  let miss = 0;

  p.push([x, y, true]);

  while (true) {
    let legal = [];
    for (let k = 0; k < 4; ++k) {
      let nx = x + dx[k];
      let ny = y + dy[k];
      if (
        nx - min_x >= H ||
        ny - min_y >= W ||
        max_x - nx >= H ||
        max_y - ny >= W
      ) {
        continue;
      }
      if (visited[[nx, ny]]) {
        continue;
      }
      legal.push(k);
    }

    if (legal.length == 0) break;
    let k = legal[Math.floor(Math.random() * legal.length)];

    let nx = x + dx[k];
    let ny = y + dy[k];
    if (
      nx - min_x >= H ||
      ny - min_y >= W ||
      max_x - nx >= H ||
      max_y - ny >= W
    ) {
      ++miss;
      continue;
    }
    if (visited[[nx, ny]]) {
      ++miss;
      continue;
    }

    visited[[nx, ny]] = true;

    let nv = [0, 0, 0];
    let r = rot(k);
    for (let i = 0; i < 3; ++i)
      for (let j = 0; j < 3; ++j) nv[i] += r[i][j] * v[j];
    for (let i = 0; i < 3; ++i) v[i] = nv[i];

    p.push([nx, ny, nv[2] == 1]);

    x = nx;
    y = ny;

    min_x = Math.min(min_x, x);
    min_y = Math.min(min_y, y);
    max_x = Math.max(max_x, x);
    max_y = Math.max(max_y, y);
  }

  p.forEach((e) => {
    e[0] -= min_x;
    e[1] -= min_y;
  });

  //make answer list
  for (let i = 0; i < H; ++i) a[i].fill(false);

  p.forEach((e) => {
    if (e[2]) a[e[0]][e[1]] = true;
  });

  console.log(p);
}
function confirmA() {
  canvas.classList.remove("correct", "incorrect");
  canvas.offsetWidth;
  let v = true;
  for (let i = 0; i < H; ++i)
    for (let j = 0; j < W; ++j) if (b[i][j] != a[i][j]) v = false;
  if (v) {
    reset();
    canvas.classList.add("correct");
  } else {
    canvas.classList.add("incorrect");
  }
}
function reset() {
  setQ();
  clear();
}
function clear() {
  for (let i = 0; i < H; ++i) b[i].fill(false);
  b[p[0][0]][p[0][1]] = true;
  drawAll();
}

function drawAll() {
  for (let i = 0; i < H; ++i) for (let j = 0; j < W; ++j) draw(i, j);
  drawLine();
}

function draw(i, j) {
  ctx.clearRect(j * L, i * L, L, L);
  ctx.strokeStyle = "black";
  ctx.strokeRect(j * L, i * L, L, L);
  for (let k = 0; k < 4; ++k) {}
  if (b[i][j]) ctx.fillRect(j * L, i * L, L, L);
}
function drawLine() {
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
  b[i][j] = !b[i][j];
  draw(i, j);
  drawLine();
};
