import * as RTKQ from "@reduxjs/toolkit/query/react";

import { API_ROOT_URL } from "../../config/env";

export const apiSplitSlice = RTKQ.createApi({
  reducerPath: "api",
  baseQuery: RTKQ.fetchBaseQuery({ baseUrl: API_ROOT_URL }),
  tagTypes: ["ChatMessage", "User"],
  endpoints: () => ({}),
});
