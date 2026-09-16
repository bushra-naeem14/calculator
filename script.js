// Math Operations
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) {
  if (b === 0) return "Nope!";
  return a / b;
}

// Variables
let firstNumber = "";
let secondNumber = "";
let currentOperator = null;
let shouldResetDisplay = false;

// DOM Elements
const previousDisplay = document.getElementById("previous-display");
const currentDisplay = document.getElementById("current-display");
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const equalsBtn = document.getElementById("equals");
const clearBtn = document.getElementById("clear");
const backspaceBtn = document.getElementById("backspace");

function getOperatorSymbol(op) {
  if (op === "/") return "÷";
  if (op === "*") return "×";
  return op;
}

// Number Typing
numberButtons.forEach(button => {
  button.addEventListener("click", () => appendNumber(button.textContent));
});

function appendNumber(number) {
  if (number === "." && currentDisplay.textContent.includes(".")) return;
  if (currentDisplay.textContent === "0" || shouldResetDisplay) {
    resetDisplay();
  }
  currentDisplay.textContent += number;
}

function resetDisplay() {
  currentDisplay.textContent = "";
  shouldResetDisplay = false;
}

// Operator Click (Displays Number + Operator at top)
operatorButtons.forEach(button => {
  button.addEventListener("click", () => setOperation(button.dataset.op));
});

function setOperation(operator) {
  if (currentOperator !== null && !shouldResetDisplay) evaluate();
  firstNumber = currentDisplay.textContent;
  currentOperator = operator;
  previousDisplay.textContent = `${firstNumber} ${getOperatorSymbol(currentOperator)}`;
  shouldResetDisplay = true;
}

// Equals Click (Calculates result & updates top history display)
equalsBtn.addEventListener("click", evaluate);

function evaluate() {
  if (currentOperator === null || shouldResetDisplay) return;

  secondNumber = currentDisplay.textContent;

  if (currentOperator === "/" && secondNumber === "0") {
    currentDisplay.textContent = "Error: Division by 0!";
    previousDisplay.textContent = "";
    currentOperator = null;
    shouldResetDisplay = true;
    return;
  }

  let result = operate(currentOperator, firstNumber, secondNumber);
  if (typeof result === "number") {
    result = Math.round(result * 100000) / 100000;
  }

  previousDisplay.textContent = `${firstNumber} ${getOperatorSymbol(currentOperator)} ${secondNumber} =`;
  currentDisplay.textContent = result;
  currentOperator = null;
}

function operate(operator, a, b) {
  a = parseFloat(a);
  b = parseFloat(b);
  switch (operator) {
    case "+": return add(a, b);
    case "-": return subtract(a, b);
    case "*": return multiply(a, b);
    case "/": return divide(a, b);
    default: return null;
  }
}

// Clear & Backspace
clearBtn.addEventListener("click", clear);
backspaceBtn.addEventListener("click", handleBackspace);

function clear() {
  currentDisplay.textContent = "0";
  previousDisplay.textContent = "";
  firstNumber = "";
  secondNumber = "";
  currentOperator = null;
  shouldResetDisplay = false;
}

function handleBackspace() {
  if (shouldResetDisplay) return;
  currentDisplay.textContent = currentDisplay.textContent.slice(0, -1);
  if (currentDisplay.textContent === "") currentDisplay.textContent = "0";
}

// Keyboard Support
window.addEventListener("keydown", handleKeyboardInput);

function handleKeyboardInput(e) {
  if (e.key >= 0 && e.key <= 9) appendNumber(e.key);
  if (e.key === ".") appendNumber(".");
  if (e.key === "=" || e.key === "Enter") evaluate();
  if (e.key === "Backspace") handleBackspace();
  if (e.key === "Escape") clear();
  if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
    setOperation(e.key);
  }
}