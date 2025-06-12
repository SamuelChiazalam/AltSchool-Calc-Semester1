const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");
let currentInput = "";
let lastInput = "";
let resultDisplayed = false;

// Helps to update the display
function updateDisplay(value) {
  display.textContent = value || "0";
}

// Handle button clicks
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const val = btn.textContent;

    if (btn.classList.contains("operator")) {
      if (val === "×") {
        appendOperator("*");
      } else if (val === "÷") {
        appendOperator("/");
      } else if (val === "%") {
        appendOperator("%");
      } else if (val === "^") {
        appendOperator("^");
      } else if (val === "+") {
        appendOperator("+");
      } else if (val === "-") {
        appendOperator("-");
      }
    } else if (btn.classList.contains("equal")) {
      calculate();
    } else if (btn.id === "clear") {
      backspace();
    } else if (val === ".") {
      appendDecimal();
    } else {
      appendNumber(val);
    }
  });
});

// Append numbers
function appendNumber(num) {
  if (resultDisplayed) {
    currentInput = "";
    resultDisplayed = false;
  }
  currentInput += num;
  updateDisplay(currentInput);
}

// Append operators
function appendOperator(op) {
  if (currentInput === "" && op !== "-") return; // Only allow negative at start
  if (/[+\-*/^%]$/.test(currentInput)) {
    // Replace last operator if double
    currentInput = currentInput.slice(0, -1) + op;
  } else {
    currentInput += op;
  }
  updateDisplay(currentInput);
  resultDisplayed = false;
}

// Append decimal
function appendDecimal() {
  // Prevent multiple decimals in a number
  const parts = currentInput.split(/[+\-*/^%]/);
  const last = parts[parts.length - 1];
  if (!last.includes(".")) {
    currentInput += ".";
    updateDisplay(currentInput);
  }
}

// Backspace
function backspace() {
  if (resultDisplayed) {
    currentInput = "";
    resultDisplayed = false;
  } else {
    currentInput = currentInput.slice(0, -1);
  }
  updateDisplay(currentInput);
}

// Calculate result
function calculate() {
  try {
    let expr = currentInput
      .replace(/÷/g, "/")
      .replace(/×/g, "*")
      .replace(/%/g, "/100");
    // Handle exponentiation
    expr = expr.replace(/(\d+(\.\d+)?)(\^)(\d+(\.\d+)?)/g, "Math.pow($1,$4)");
    let evalResult = eval(expr);
    if (evalResult === undefined || isNaN(evalResult)) throw Error();
    updateDisplay(evalResult);
    currentInput = evalResult.toString();
    resultDisplayed = true;
  } catch {
    updateDisplay("Error");
    currentInput = "";
    resultDisplayed = true;
  }
}

// Keyboard support (let's you use your keyboard for input)
document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") appendNumber(e.key);
  if (["+", "-", "*", "/", "^", "%"].includes(e.key)) appendOperator(e.key);
  if (e.key === ".") appendDecimal();
  if (e.key === "Backspace") backspace();
  if (e.key === "Enter" || e.key === "=") calculate();
  if (e.key === "Delete") {
    currentInput = "";
    updateDisplay("");
  }
});

//Clear all input
document.getElementById("clearAll").addEventListener("click", () => {
  currentInput = "";
  updateDisplay("");
  resultDisplayed = false;
});

//History section
let historyArr = [];

function updateHistory() {
  const historyDiv = document.getElementById('history');
  historyDiv.innerHTML = historyArr.length
    ? historyArr.map(item => `<div>${item}</div>`).join('')
    : '<div>No history yet.</div>';
}

// Toggle history display
document.getElementById('toggleHistory').addEventListener('click', () => {
  const historyDiv = document.getElementById('history');
  historyDiv.style.display = historyDiv.style.display === 'none' ? 'block' : 'none';
});

//"Calculate()" function to save history (updated)
function calculate() {
  try {
    let expr = currentInput
      .replace(/÷/g, "/")
      .replace(/×/g, "*")
      .replace(/%/g, "/100");
    expr = expr.replace(/(\d+(\.\d+)?)(\^)(\d+(\.\d+)?)/g, "Math.pow($1,$4)");
    let evalResult = eval(expr);
    if (evalResult === undefined || isNaN(evalResult)) throw Error();
    updateDisplay(evalResult);
    // Save to history
    historyArr.unshift(`${currentInput} = ${evalResult}`);
    if (historyArr.length > 10) historyArr.pop(); // Keep last 10
    updateHistory();
    currentInput = evalResult.toString();
    resultDisplayed = true;
  } catch {
    updateDisplay("Error");
    currentInput = "";
    resultDisplayed = true;
  }
}