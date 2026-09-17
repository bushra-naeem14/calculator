function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

function modulo(a, b) {
  return a % b;
}

function formatResult(num) {
  if (Number.isFinite(num)) {
    return Number(num.toFixed(2));
  }

  return num;
}

function zeroAlert() {
  alert("Nice try. It's 0 then 🚫");
}

function performCalculation(num1, operator, num2) {
  switch (operator) {
    case "+":
      return formatResult(add(num1, num2));

    case "-":
      return formatResult(subtract(num1, num2));

    case "*":
      return formatResult(multiply(num1, num2));

    case "/":
      if (num2 === 0) {
        zeroAlert();
        return {
          error: "Division by 0!",
        };
      }

      return formatResult(divide(num1, num2));

    case "%":
      if (num2 === 0) {
        zeroAlert();
        return {
          error: "Modulo by 0!",
        };
      }

      return formatResult(modulo(num1, num2));

    default:
      return {
        error: "Error: Unknown operator",
      };
  }
}

let firstNumber = "";
let secondNumber = "";
let operator = "";

const previousDisplay = document.getElementById("previous-display");
const currentDisplay = document.getElementById("current-display");

const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");

const equalsBtn = document.querySelector(".equals");
const clearBtn = document.querySelector(".clear");
const backspaceBtn = document.querySelector(".backspace");
const decimalBtn = document.querySelector(".decimal");

function getCurrentNumber() {
  return operator === "" ? firstNumber : secondNumber;
}

function updateDecimalButtonAvailability() {
  const currentNumber = getCurrentNumber();
  decimalBtn.disabled = currentNumber.includes(".");
}

function clearErrorIfNeeded() {
  if (currentDisplay.textContent.startsWith("Error")) {
    clearCalculator();
  }
}

function handleNumber(number) {
  clearErrorIfNeeded();

  if (operator === "") {
    firstNumber += number;
    currentDisplay.textContent = firstNumber;
  } else {
    secondNumber += number;
    currentDisplay.textContent = secondNumber;
  }

  updateDecimalButtonAvailability();
}

function handleDecimal() {
  clearErrorIfNeeded();

  if (operator === "") {
    if (firstNumber.includes(".")) {
      return;
    }

    firstNumber += firstNumber === "" ? "0." : ".";

    currentDisplay.textContent = firstNumber;
  } else {
    if (secondNumber.includes(".")) {
      return;
    }

    secondNumber += secondNumber === "" ? "0." : ".";

    currentDisplay.textContent = secondNumber;
  }

  updateDecimalButtonAvailability();
}

function handleOperator(selectedOperator) {
  if (firstNumber === "") {
    return;
  }

  if (operator !== "" && secondNumber !== "") {
    const result = performCalculation(
      Number(firstNumber),
      operator,
      Number(secondNumber),
    );

    if (result && result.error) {
      showError(result.error);
      return;
    }

    firstNumber = result.toString();
    secondNumber = "";

    currentDisplay.textContent = firstNumber;
  }

  operator = selectedOperator;

  previousDisplay.textContent = `${firstNumber} ${operator}`;

  updateDecimalButtonAvailability();
}

function calculate() {
  if (firstNumber === "" || operator === "" || secondNumber === "") {
    return;
  }

  const result = performCalculation(
    Number(firstNumber),
    operator,
    Number(secondNumber),
  );

  if (result && result.error) {
    showError(result.error);
    return;
  }
  previousDisplay.textContent = `${firstNumber} ${operator} ${secondNumber} =`;

  currentDisplay.textContent = result;

  firstNumber = result.toString();
  secondNumber = "";
  operator = "";

  updateDecimalButtonAvailability();
}

function showError(message) {
  currentDisplay.textContent = message;
  previousDisplay.textContent = "";

  firstNumber = "";
  secondNumber = "";
  operator = "";

  updateDecimalButtonAvailability();
}

function handleBackspace() {
  if (currentDisplay.textContent.startsWith("Error")) {
    return;
  }

  if (operator === "") {
    firstNumber = firstNumber.slice(0, -1);

    currentDisplay.textContent = firstNumber || "0";
  } else {
    secondNumber = secondNumber.slice(0, -1);

    currentDisplay.textContent = secondNumber || "0";
  }

  updateDecimalButtonAvailability();
}

function clearCalculator() {
  firstNumber = "";
  secondNumber = "";
  operator = "";

  currentDisplay.textContent = "0";
  previousDisplay.textContent = "";

  updateDecimalButtonAvailability();
}

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    handleNumber(button.textContent);
  });
});

operatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedOperator = button.textContent;
    if (selectedOperator === "÷") {
      handleOperator("/");
    } else {
      handleOperator(selectedOperator);
    }
  });
});

equalsBtn.addEventListener("click", calculate);

backspaceBtn.addEventListener("click", handleBackspace);

clearBtn.addEventListener("click", clearCalculator);

decimalBtn.addEventListener("click", handleDecimal);

document.addEventListener("keydown", (event) => {
  if (event.key >= "0" && event.key <= "9") {
    handleNumber(event.key);
    return;
  }

  if (event.key === ".") {
    handleDecimal();
    return;
  }

  if (event.key === "+") {
    handleOperator("+");
    return;
  }

  if (event.key === "-") {
    handleOperator("-");
    return;
  }

  if (event.key === "*") {
    handleOperator("*");
    return;
  }

  if (event.key === "/") {
    handleOperator("/");
    return;
  }

  if (event.key === "%") {
    handleOperator("%");
    return;
  }

  if (event.key === "Enter" || event.key === "=") {
    calculate();
    return;
  }

  if (event.key === "Backspace") {
    handleBackspace();
    return;
  }

  if (event.key === "Escape") {
    clearCalculator();
  }
});

clearCalculator();
