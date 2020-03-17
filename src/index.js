function eval() {
  // Do not use eval!!!
  return;
}

class ACTION {
  constructor(symbol) {
    this.symbol = symbol;
    switch (symbol) {
      case "*":
        this.priority = 2;
        break;
      case "/":
        this.priority = 2;
        break;
      case "+":
        this.priority = 1;
        break;
      case "-":
        this.priority = 1;
        break;
      default:
        this.priority = 0;
        break;
    }
  }
}

function expressionCalculator(expr) {
  try {
    let result;
    var startArrayNumbers = expr
      .split(" ")
      .join("")
      .split(/[\\[+*-/?(){|^$]/g)
      .filter(item => item.length > 0);
    var startArrayActions = expr
      .split(" ")
      .join("")
      .split(/\d/g)
      .join("")
      .split("")
      .filter(item => item.length > 0);

    let lengthOpenParentheses = startArrayActions.reduce(
      (acc, action) => (acc += Number(action === "(")),
      0
    );
    let lengthCloseParentheses = startArrayActions.reduce(
      (acc, action) => (acc += Number(action === ")")),
      0
    );
    if (lengthOpenParentheses !== lengthCloseParentheses)
      throw "ExpressionError: Brackets must be paired";

    result = getNumber(startArrayNumbers, startArrayActions)[0];

    if (Number(result) >= 0 || Number(result) < 0) {
      if (Number(result) < -10 || Number(result) > 10) {
        return +Number(result).toFixed(4);
      } else return +result;
    } else throw new Error();
  } catch (error) {
    throw new Error(error);
  }
}

function getNumber(startArrayNumbers, startArrayActions) {
  let stackNumbers = [];
  let stackActions = [];

  while (1 > 0) {
    stackNumbers.push(+startArrayNumbers.shift());
    let action = new ACTION(startArrayActions.shift());
    let previousAction = getPrevAction(stackActions);
    if (action.symbol === undefined) {
      while (stackActions.length !== 0) {
        let tempNumber = doAction(stackNumbers, stackActions.pop().symbol);
        stackNumbers.push(tempNumber);
      }
      break;
    }
    if (action.symbol === "(") {
      let tempNumber = stackNumbers.pop();
      startArrayNumbers.unshift(tempNumber);
      stackNumbers.push(getNumber(startArrayNumbers, startArrayActions)[0]);
      previousAction = getPrevAction(stackActions);
      startArrayNumbers.unshift(stackNumbers.pop());
      continue;
    }
    if (action.symbol === ")") {
      do {
        let tempNumber = doAction(stackNumbers, stackActions.pop().symbol);
        stackNumbers.push(tempNumber);
      } while (stackActions.length !== 0);
      break;
    }
    if (
      previousAction === "undefined" ||
      (action.priority > previousAction.priority && action.symbol !== "(")
    ) {
      stackActions.push(action);
    } else {
      while (
        getPrevAction(stackActions) !== "undefined" &&
        getPrevAction(stackActions).priority >= action.priority
      ) {
        let resultActions = doAction(stackNumbers, stackActions.pop().symbol);
        stackNumbers.push(resultActions);
      }
      stackActions.push(action);
    }
  }
  return stackNumbers;
}

function getPrevAction(array) {
  return array[array.length - 1] || "undefined";
}

function getNextAction(array) {
  return array[0];
}

function doAction(array, action) {
  let secondNumber = array.pop();
  let firstNumber = array.pop();
  switch (action) {
    case "+":
      return firstNumber + secondNumber;
    case "-":
      return firstNumber - secondNumber;
    case "*":
      return firstNumber * secondNumber;
    case "/":
      if (secondNumber === 0) throw "TypeError: Division by zero.";
      return firstNumber / secondNumber;
  }
}

module.exports = {
  expressionCalculator
};
