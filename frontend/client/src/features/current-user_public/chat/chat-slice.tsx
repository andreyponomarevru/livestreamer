import * as RTK from "@reduxjs/toolkit";

import {
  type APIResponseError,
  type APIResponseSuccess,
  type ChatMsg,
} from "../../../types";
import { apiSplitSlice } from "../../api";
import type { RootState } from "../../../app/store";

//
// Reducer
//

type State = {
  sendMessageLoading: boolean;
  isVisible: boolean;
  isHearting: boolean;
  hasCurrentUserSubmittedComment: boolean;
  loadedAll: boolean;
  chatInputText: string;
};

const initialState: State = {
  sendMessageLoading: false,
  isVisible: true,
  isHearting: false,
  hasCurrentUserSubmittedComment: false,
  loadedAll: false,
  chatInputText: "",
};

let tempId = 0;

const chatSlice = RTK.createSlice({
  name: "chat",
  initialState,
  reducers: {
    // getChatHistory: () => {} // replaced with RTK Query
    // addNewMessage: () => {},
    messageDeleted: () => {},
    heartMessageAdded: () => {},

    chatVisibleSet: () => {},
    crowdVisibleSet: () => {},

    crowdListSet: () => {},
    crowdMemberAdded: () => {},
    crowdMembersRemoved: () => {},
  },
});

const { getChatHistory } = chatSlice.actions;

export const chatReducer = chatSlice.reducer;

//
// Endpoints
//

type ChatHistoryResponse = {
  nextCursor: string | null;
  messages: ChatMsg[];
};

export const extendedAPIslice = apiSplitSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChatHistory: builder.query<ChatHistoryResponse, string | void>({
      providesTags: ["ChatMessage"],
      query(nextCursor = "") {
        return {
          url: `/chat/messages?limit=20${nextCursor ? `&next_cursor=${nextCursor}` : ""}`,
          method: "GET",
        };
      },
      transformResponse(rawResult: APIResponseSuccess<ChatHistoryResponse>) {
        return rawResult.results;
      },
      transformErrorResponse(rawResult) {
        return rawResult.data as APIResponseError;
      },
    }),

    postNewMessage: builder.mutation<ChatMsg, { message: string }>({
      query({ message }) {
        return {
          url: "/chat/messages",
          method: "POST",
          body: { message },
          credentials: "include",
        };
      },
      async onQueryStarted({ message }, queryLifeCycleApi) {
        const state = queryLifeCycleApi.getState() as RootState;

        // Do optimistic update:
        // here we set the message fields that normally should be set by API (message id, timestamps, etc) to the temp values. If the request succeeds, we will update these fields with the data (message id, timestamps, etc) returned from the API
        const action = extendedAPIslice.util.updateQueryData(
          "getChatHistory",
          "",
          (draft) => {
            draft.messages.push({
              id: --tempId,
              userId: state.currentUser.me!.id || -1,
              userUUID: state.currentUser.me!.uuid || "",
              username: state.currentUser.me!.username || "",
              createdAt: new Date().toISOString(),
              message,
              likedByUserId: [],
            });
          },
        );
        const postNewMessageResult = queryLifeCycleApi.dispatch(action);

        try {
          // Wait for the API response
          const { data: savedMessage } = await queryLifeCycleApi.queryFulfilled;
          // After the API has successfully saved the message, update the cache
          // with response data:
          const action = extendedAPIslice.util.updateQueryData(
            "getChatHistory",
            "",
            (draft) => {
              const index = draft.messages.findIndex((msg) => {
                return msg.id === tempId;
              });

              if (index !== -1) draft.messages[index] = savedMessage;
            },
          );
          queryLifeCycleApi.dispatch(action);
        } catch {
          // Undo cache update if the API call failed
          postNewMessageResult.undo();
        }
      },
      transformResponse(rawApiResponse: APIResponseSuccess<ChatMsg>) {
        return rawApiResponse.results;
      },
      transformErrorResponse(rawResult) {
        return rawResult.data as APIResponseError;
      },
    }),

    deleteMessage: builder.mutation<
      void,
      { messageId: number; userId?: number }
    >({
      query({ messageId, userId }) {
        return {
          url: userId
            ? `/moderation/chat/messages/${messageId}?user_id=${userId}`
            : `/chat/messages/${messageId}`,
          method: "DELETE",
          credentials: "include",
        };
      },
      async onQueryStarted({ messageId }, queryLifeCycleApi) {
        const action = extendedAPIslice.util.updateQueryData(
          "getChatHistory",
          "",
          (draft) => {
            const index = draft.messages.findIndex(
              (msg) => msg.id === messageId,
            );
            if (index !== -1) draft.messages.splice(index, 1);
          },
        );
        const deleteMessageResult = queryLifeCycleApi.dispatch(action);

        try {
          await queryLifeCycleApi.queryFulfilled;
        } catch {
          deleteMessageResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetChatHistoryQuery,
  usePostNewMessageMutation,
  useDeleteMessageMutation,
} = extendedAPIslice;

//
// Selectors
//

const emptyChatHistory: ChatMsg[] = [];

export const selectChatHistoryResult =
  extendedAPIslice.endpoints.getChatHistory.select();

export const selectChatHistory = RTK.createSelector(
  selectChatHistoryResult,
  (chatHistoryResult) => chatHistoryResult.data ?? emptyChatHistory,
);
