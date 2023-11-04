import { ACTIONS } from "./App";

export default function OperationButton({ dispatch, operation, className }) {
  return (
    <button
      onClick={() =>
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })
      }
      className="cta5"
    >
      {operation}
    </button>
  );
}
