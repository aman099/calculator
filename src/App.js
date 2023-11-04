import { useEffect, useReducer, useState } from "react";
import DigitButton from "./DigitButton";
import "./App.css";
import OperationButton from "./OperationButton";
import UilReact from "@iconscout/react-unicons/icons/uil-react";
import gsap from "gsap";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }

      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentOperand == null) {
        return state;
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };

    case ACTIONS.CLEAR:
      return {}; //return back to our initialState value(which we set in useReducer()'s 2nd argument below)

    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }

      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1)
        return {
          ...state,
          currentOperand: null,
        };

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    default:
      return state;
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(current)) return "";

  let computation = "";

  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "x":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
  }

  return computation.toString();
}

// To format the Integers into comma-separated Number system
const INTEGER_FORMATTER = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return;

  const [integer, decimal] = operand.split(".");

  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  // GSAP-Animations
  useEffect(() => {
    // gsap.set();
    let textAnimation = gsap.timeline();

    textAnimation.fromTo(
      ".popin",
      { scale: 1.3, opacity: 0 },
      {
        scale: 1,

        delay: 0.35,
        duration: 2.5,
        ease: "elastic.out(1.5,1)",
        opacity: 1,
      }
    );

    textAnimation.fromTo(
      ".cta5",
      {
        x: 100,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
      },
      "<40%"
    );
    textAnimation.fromTo(
      ".cta6",
      {
        opacity: 0,
      },
      {
        opacity: 1,
      },
      "<40%"
    );
  }, []);

  return (
    <div className="calculator-grid popin">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two cta5"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button
        className="cta5"
        onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          data-name="Layer 1"
          viewBox="0 0 64 64"
          id="backspace"
          height="40"
        >
          <polygon
            fill="none"
            stroke="#010101"
            strokeMiterlimit="10"
            strokeWidth="4"
            points="24.5 10 61.5 10 61.5 54 24.5 54 2.5 32 24.5 10"
          ></polygon>
          <line
            x1="29.5"
            x2="49.5"
            y1="22"
            y2="42"
            fill="none"
            stroke="#010101"
            strokeMiterlimit="10"
            strokeWidth="4"
          ></line>
          <line
            x1="49.5"
            x2="29.5"
            y1="22"
            y2="42"
            fill="none"
            stroke="#010101"
            strokeMiterlimit="10"
            strokeWidth="4"
          ></line>
        </svg>
      </button>
      <OperationButton
        className="className"
        operation="÷"
        dispatch={dispatch}
      />
      <DigitButton className="className" digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="x" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        className="span-two cta5"
      >
        =
      </button>
    </div>
  );
}

export default App;
