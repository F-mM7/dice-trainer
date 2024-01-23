//create question
let ans;
function setQuestion() {
  ans = Math.floor(Math.random() * 26);
  display.innerHTML = ans + 1;
  console.log(String.fromCodePoint("A".codePointAt(0) + ans));
}
setQuestion();

function confirmAnswer(c) {
  return function () {
    display.classList.remove("correct", "incorrect");
    display.offsetWidth;
    if (c.codePointAt(0) - "A".codePointAt(0) == ans) {
      setQuestion();
      display.classList.add("correct");
    } else {
      display.classList.add("incorrect");
    }
  };
}

//create software keyboard
const qwerty = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
const boardMergin = ["0", "2%", "7%"];
for (let i = 0; i < 3; ++i) {
  let ul = document.createElement("ul");
  let m = document.createElement("li");
  m.style.width = boardMergin[i];
  ul.appendChild(m);
  for (let c of qwerty[i]) {
    let b = document.createElement("button");
    b.id = "Key" + c;
    b.innerHTML = c;
    b.onclick = confirmAnswer(c);

    let li = document.createElement("li");
    li.appendChild(b);
    ul.appendChild(li);
  }
  keyboard.appendChild(ul);
}

//hardware keyboard
document.addEventListener("keyup", upKey);
document.addEventListener("keydown", downKey);

function downKey(e) {
  if (!e.ctrlKey && e.code.substring(0, 3) == "Key") {
    document.getElementById(e.code).classList.add("press");
  }
}
function upKey(e) {
  if (!e.ctrlKey && e.code.substring(0, 3) == "Key") {
    document.getElementById(e.code).classList.remove("press");
    confirmAnswer(e.code[3])();
  }
}
