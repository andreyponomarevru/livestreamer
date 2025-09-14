import React from "react";

type Action =
  | { type: "ADD"; payload: { index: number; number: number } }
  | { type: "SUBSTRACT"; payload: { index: number; number: number } }
  | { type: "RESET" }
  | { type: "CALCULATE" };
type State = { result: number; items: number[] };

function sumReducer(state: State, action: Action) {
  switch (action.type) {
    case "ADD":
      console.log(state.items.reduce((a, b) => a + b));
      return {
        ...state,
        items: [
          ...state.items,
          (state.items[action.payload.index] =
            state.items[action.payload.index] + action.payload.number),
        ],
        result: state.items.reduce((a, b) => a + b),
      };
    case "SUBSTRACT":
      return {
        ...state,
        items: [
          ...state.items,
          (state.items[action.payload.index] =
            state.items[action.payload.index] - action.payload.number),
        ],
        result: state.items.reduce((a, b) => a + b),
      };

    default:
      throw new Error();
  }
}

export function useSumHook() {
  const initialState: State = {
    result: 0,
    items: [0, 0, 0, 0, 0, 0],
  };

  const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(
    sumReducer,
    initialState
  );

  function resetState() {
    dispatch({ type: "RESET" });
  }

  function add(index: number, number: number) {
    dispatch({ type: "ADD", payload: { index, number } });
  }

  function substract(index: number, number: number) {
    dispatch({ type: "SUBSTRACT", payload: { index, number } });
  }

  return { state, resetState, add, substract };
}
