import * as RTK from "@reduxjs/toolkit";
import { type RootState } from "../../../app/store";

type State = {
  likes: number;
  status: string;
  time: number;
};

const initialState: State = {
  likes: 0,
  status: "offline",
  time: 0,
};

const audioSlice = RTK.createSlice({
  name: "audio",
  initialState,
  reducers: {
    streamLiked: (state, action) => {
      state.likes++;
    },
    statusStarted: (state, action) => {
      return { ...state, status: "online" };
    },
    streamEnded: (state, action) => {
      return { ...state, status: "offline" };
    },
  },
});

// Selectors

export function selectStreamStatus(state: RootState) {
  return state.audio.status;
}

// Actions

export const { streamLiked } = audioSlice.actions;

export const streamReducer = audioSlice.reducer;
