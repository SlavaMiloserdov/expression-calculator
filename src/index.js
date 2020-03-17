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
    let stackNumbers = [];
    let stackActions = [];
    let startArrayNumbers = expr
      .split(" ")
      .join("")
      .split(/[\\[+*-/?(){|^$]/g)
      .filter(item => item.length > 0);
    let startArrayActions = expr
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

    let lengthNumbers = startArrayNumbers.length;
    let lengthActions = startArrayActions.length;

    while (1 > 0) {
      stackNumbers.push(+startArrayNumbers.shift());
      let action = new ACTION(startArrayActions.shift());
      let previousAction = getPrevAction(stackActions);
      let nextAction = getNextAction(startArrayActions);
      if (action.symbol === undefined) {
        if (lengthActions > lengthNumbers) stackNumbers.pop();
        do {
          let tempNumber = doAction(stackNumbers, stackActions.pop().symbol);
          stackNumbers.push(tempNumber);
        } while (stackActions.length !== 0);
        break;
      }
      if (action.symbol === "(") {
        let tempArrayActions = [];
        let tempArrayNumbers = [];

        tempArrayNumbers.push(stackNumbers.pop());

        while (getNextAction(startArrayActions) !== ")") {
          tempArrayActions.push(startArrayActions.shift());
        }
        startArrayActions.shift();
        for (let i = 0; i < tempArrayActions.length; i++) {
          tempArrayNumbers.push(startArrayNumbers.shift());
        }

        stackNumbers.push(
          doActionInParentheses(tempArrayNumbers, tempArrayActions)[0]
        );
        if (startArrayActions.length !== 0) {
          let newAction = new ACTION(startArrayActions.shift());
          while (
            getPrevAction(stackActions) !== "undefined" &&
            getPrevAction(stackActions).priority >= newAction.priority
          ) {
            let resultActions = doAction(
              stackNumbers,
              stackActions.pop().symbol
            );
            stackNumbers.push(resultActions);
          }
          stackActions.push(newAction);
          lengthActions = lengthActions - 1;
        }
        continue;
      }
      if (
        previousAction === "undefined" ||
        action.priority > previousAction.priority
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
    if (Number(stackNumbers) >= 0 || Number(stackNumbers) < 0) {
      if (Number(stackNumbers) < -10 || Number(stackNumbers) > 10) {
        return +Number(stackNumbers).toFixed(4);
      } else return +stackNumbers;
    } else throw new Error();
  } catch (error) {
    throw new Error(error);
  }
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

function doActionInParentheses(arrayOfNumbers, arrayOfActions) {
  let stackNumbers = [];
  let stackActions = [];
  while (1 > 0) {
    stackNumbers.push(+arrayOfNumbers.shift());
    let action = new ACTION(arrayOfActions.shift());
    let previousAction = getPrevAction(stackActions);
    // let nextAction = getNextAction(arrayOfActions);
    if (action.symbol === undefined) {
      do {
        let tempNumber = doAction(stackNumbers, stackActions.pop().symbol);
        stackNumbers.push(tempNumber);
      } while (stackActions.length !== 0);
      break;
    }
    if (
      previousAction === "undefined" ||
      action.priority > previousAction.priority
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

module.exports = {
  expressionCalculator
};
