import * as RTK from "@reduxjs/toolkit";
import { listenerMiddleware } from "./listener-middleware";
import { apiSplitSlice } from "../features/api";
import { currentUserReducer } from "../features/current-user_private/current-user-slice";
import { streamReducer } from "../features/current-user_public/stream";
import { chatReducer } from "../features/current-user_public/chat/chat-slice";

export const store = RTK.configureStore({
  reducer: {
    audio: streamReducer,
    chat: chatReducer,
    channel: () => ({}),
    crowd: () => ({}),
    currentUser: currentUserReducer,
    hub: () => ({
      socketId: "",
      isHubCrowdConnected: false,
      isHubConnected: true,
    }),
    notifications: () => ({}),
    events: () => ({}),

    [apiSplitSlice.reducerPath]: apiSplitSlice.reducer,
  },

  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat(apiSplitSlice.middleware);
  },

  devTools: process.env.NODE_ENV !== "production",
});

// Typescript helpers for typing
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export type AppThunk<ReturnType = void> = RTK.ThunkAction<
  ReturnType,
  RootState,
  unknown,
  RTK.UnknownAction
>;
