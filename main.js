const ctx = canvas.getContext("2d");
const H = 12;
const W = 12;
const L = 100;
const T = 4;

canvas.height = H * L;
canvas.width = W * L;
let b = new Array(H).fill(new Array(W).fill(false));

window.onload = reset;
resetButton.onclick = reset;

function reset() {
  for (let i = 0; i < H; ++i) b[i].fill(false);
  drawAll();
}

function drawAll() {
  // ctx.clearRect(0, 0, canvas.height, canvas.width);
  for (let i = 0; i < H; ++i) for (let j = 0; j < W; ++j) draw(i, j);
}

function draw(i, j) {
  ctx.fillStyle = b[i][j] ? "black" : "white";
  ctx.fillRect(j * L, i * L, L, L);
  ctx.lineWidth = T;
  ctx.strokeRect(j * L, i * L, L, L);
}

canvas.onclick = function (event) {
  const rct = canvas.getBoundingClientRect();
  let i = Math.floor(((event.pageY - rct.top) * H) / rct.height);
  let j = Math.floor(((event.pageX - rct.left) * W) / rct.width);
  console.log(i, j);
  b[i][j] = !b[i][j];
  draw(i, j);
};
