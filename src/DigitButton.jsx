import { ACTIONS } from "./App";

export default function DigitButton({ dispatch, digit, className }) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}
      className="cta6"
    >
      {digit}
    </button>
  );
}
