import { useReducer } from "react";

import { parseResponse } from "../utils";
import { useIsMounted } from "./use-is-mounted";
import { handleResponseErr } from "../utils";
import { type ParsedResponse } from "../utils";
import type { APIError } from "../types";

// TODO: delete this type:
export interface APIResponse<Results> {
  error: APIError | Error | null | unknown;
  isLoading: boolean;
  response: ParsedResponse<Results> | null;
}

type FetchInit = { type: "FETCH_INIT" };
type FetchSuccess<T> = {
  type: "FETCH_SUCCESS";
  payload: APIResponse<T>["response"];
};
type FetchFailure<T> = {
  type: "FETCH_FAILURE";
  error: APIResponse<T>["error"] | Error;
};
type ResetState = { type: "RESET_STATE" };

type Action<T> = FetchInit | FetchSuccess<T> | FetchFailure<T> | ResetState;
type State<T> = APIResponse<T>;

function dataFetchReducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case "FETCH_INIT":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        error: null,
        response: action.payload,
      };
    case "FETCH_FAILURE":
      return { ...state, isLoading: false, error: action.error };
    case "RESET_STATE": {
      return { isLoading: false, error: null, response: null };
    }
    default:
      throw new Error();
  }
}

function useFetch<ResponseBody>(): {
  state: APIResponse<ResponseBody>;
  fetchNow: (
    url: RequestInfo,
    request?: RequestInit | undefined
  ) => Promise<void>;
  resetState: () => void;
} {
  const initialState: State<ResponseBody> = {
    isLoading: false,
    error: null,
    response: null,
  };

  const [state, dispatch] = useReducer<
    React.Reducer<State<ResponseBody>, Action<ResponseBody>>
  >(dataFetchReducer, initialState);

  // TODO get rid of isMounted hook, delete it from the project, code smell
  const isMounted = useIsMounted();

  function resetState() {
    dispatch({ type: "RESET_STATE" });
  }

  async function fetchNow(url: RequestInfo, request?: RequestInit) {
    dispatch({ type: "FETCH_INIT" });

    let res: Response;

    try {
      res = await fetch(url, { ...request, credentials: "include" });
    } catch {
      if (isMounted) {
        dispatch({
          type: "FETCH_FAILURE",
          error: new Error(
            "Something went wrong. Please check your connection."
          ),
        });
      }
      return;
    }

    try {
      const resBody = await parseResponse<ResponseBody>(res);
      console.log("[useFetch] Response body:", resBody);

      if (isMounted) {
        dispatch({ type: "FETCH_SUCCESS", payload: resBody });
      }
    } catch (err) {
      const parsedErr = await handleResponseErr(err as Response);
      dispatch({
        type: "FETCH_FAILURE",
        error: parsedErr,
      });
    }
  }

  return { state, fetchNow, resetState };
}

export { State, useFetch };
