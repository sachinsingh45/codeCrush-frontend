import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    users: [],
    loading: false,
    error: null
  },
  reducers: {
    addFeed: (state, action) => {
      state.users = action.payload;
      state.loading = false;
      state.error = null;
    },
    removeUserFromFeed: (state, action) => {
      state.users = state.users.filter((user) => user._id !== action.payload);
    },
    setFeedLoading: (state, action) => {
      state.loading = action.payload;
    },
    setFeedError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { addFeed, removeUserFromFeed, setFeedLoading, setFeedError } = feedSlice.actions;
export default feedSlice.reducer;