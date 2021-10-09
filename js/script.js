const screen = document.querySelector(".input-screen");
const screenTotalLog = document.querySelector(".screen-log");
const buttons = document.querySelectorAll(".calc-num");
const delValue = document.querySelector(".calc-del");

let activeString = "";
let logNumber = 0;
let logSign = "";
let freshStart = false;

// 1,000,000,000
function separateNumber(str) {
  str = str.toString();
  if (str.includes(".")) {
    return str;
  }
  let formatedNum = "";
  let posFromStart = 0;
  for (let i = str.length - 1; 0 <= i; i--) {
    if (posFromStart % 3 === 0) {
      formatedNum += "," + str[i];
      posFromStart += 1;
      continue;
    }
    formatedNum += str[i];
    posFromStart += 1;
  }
  if (formatedNum.startsWith(",")) {
    formatedNum = formatedNum.slice(1);
  }
  return formatedNum
    .split(",")
    .map((elem) => elem.split("").reverse().join(""))
    .reverse()
    .join(",");
}

function strip(number) {
  return parseFloat(number.toPrecision(12));
}

function numtoFix(n) {
  if (Number(n) === parseInt(n)) {
    return true;
  }
  return false;
}

// 10+26+33x12
function operations(str) {
  let numbers = str.split(/\+|\-|\x|\//g);

  const operators = str.replace(/[0-9]|\./g, "").split("");

  if (!numbers[numbers.length - 1]) {
    numbers = numbers.filter(Boolean);
    operators.pop();
  }

  let divide = operators.indexOf("/");
  while (divide != -1) {
    numbers.splice(divide, 2, numbers[divide] / numbers[divide + 1]);
    operators.splice(divide, 1);
    divide = operators.indexOf("/");
  }

  let multiply = operators.indexOf("x");
  while (multiply != -1) {
    numbers.splice(multiply, 2, numbers[multiply] * numbers[multiply + 1]);
    operators.splice(multiply, 1);
    multiply = operators.indexOf("x");
  }

  let subtract = operators.indexOf("-");
  while (subtract != -1) {
    numbers.splice(subtract, 2, numbers[subtract] - numbers[subtract + 1]);
    operators.splice(subtract, 1);
    subtract = operators.indexOf("-");
  }

  let add = operators.indexOf("+");
  while (add != -1) {
    numbers.splice(
      add,
      2,
      parseFloat(numbers[add]) + parseFloat(numbers[add + 1])
    );
    operators.splice(add, 1);
    add = operators.indexOf("+");
  }

  return numbers[0];
}

let arrLog = [];
buttons.forEach((button) =>
  button.addEventListener("click", function () {
    const value = button.textContent;
    activeString = activeString.toString();
    if (value === "RESET") {
      activeString = "";
      logNumber = undefined;
      logSign = "";
      freshStart = false;
      arrLog = [];
    } else if (value === "=") {
      // EQUAL OPERATION, just for ctrl f
      freshStart = true;
      arrLog.push(activeString);
      activeString = strip(operations(arrLog.join("")));
    }
    if (
      (value === "+" && !activeString.endsWith(".")) ||
      (value === "-" && !activeString.endsWith(".")) ||
      (value === "x" && !activeString.endsWith(".")) ||
      (value === "/" && !activeString.endsWith("."))
    ) {
      if (freshStart) {
        arrLog = [];
      }
      freshStart = false;
      logSign = value;
      if (!activeString) {
        arrLog.pop();
        arrLog.push(value);
      } else {
        arrLog.push(activeString, value);
      }
      activeString = "";
    }
    if (value === "DEL") {
      if (freshStart) {
        arrLog = [];
      }
      activeString = activeString.slice(0, activeString.length - 1);
    }
    if (value === "." && activeString && !activeString.includes(".")) {
      activeString += value;
    }
    if (
      (value === "0" && activeString !== "0") ||
      value === "0" ||
      Number(value)
    ) {
      activeString += value;
    }
    screenTotalLog.textContent = arrLog.join("");
    screen.textContent = separateNumber(activeString);
  })
);

const slider = document.querySelector(".theme-slider");
const circle = document.querySelector(".circle");
const themeLocalStorage = "calc-theme-";

window.addEventListener("load", function () {
  const pos = window.localStorage.getItem(`${themeLocalStorage}-pos`);
  const theme = window.localStorage.getItem(`${themeLocalStorage}-theme`);
  if (pos) {
    circle.style.transform = `translateX(${pos * 25}px)`;
    document.documentElement.setAttribute("data-theme", theme);
  } else {
    circle.style.transform = `translateX(${0 * 25}px)`;
    document.documentElement.setAttribute("data-theme", "dark");
  }
});

slider.addEventListener("click", function (e) {
  // coords.width
  const coords = this.getBoundingClientRect();
  const clickPos = e.pageX - coords.x;

  if (clickPos < coords.width / 3) {
    const pos = 0;
    circle.style.transform = `translateX(${pos * 23}px)`;
    window.localStorage.setItem(`${themeLocalStorage}-pos`, pos);
    window.localStorage.setItem(`${themeLocalStorage}-theme`, "dark");
    document.documentElement.setAttribute("data-theme", "dark");
  } else if (
    clickPos >= coords.width / 3 &&
    clickPos <= coords.width * (2 / 3)
  ) {
    const pos = 1;
    circle.style.transform = `translateX(${pos * 23}px)`;
    window.localStorage.setItem(`${themeLocalStorage}-pos`, pos);
    window.localStorage.setItem(`${themeLocalStorage}-theme`, "light");
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    const pos = 2;
    circle.style.transform = `translateX(${pos * 23}px)`;
    window.localStorage.setItem(`${themeLocalStorage}-pos`, pos);
    window.localStorage.setItem(`${themeLocalStorage}-theme`, "purple");
    document.documentElement.setAttribute("data-theme", "purple");
  }
});
