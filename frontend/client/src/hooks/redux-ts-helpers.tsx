// Doc: https://redux.js.org/usage/usage-with-typescript#define-typed-hooks

import type { Action } from "redux";
import { useDispatch, useSelector, useStore } from "react-redux";
import { type ThunkDispatch } from "@reduxjs/toolkit";

import type { AppDispatch, AppStore, RootState } from "../app/store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

// Doc: https://redux.js.org/usage/usage-with-typescript#type-checking-redux-thunks
export type ThunkAction<R, S, E, A extends Action> = (
  dispatch: ThunkDispatch<S, E, A>,
  getState: () => S,
  extraArgument: E
) => R;
