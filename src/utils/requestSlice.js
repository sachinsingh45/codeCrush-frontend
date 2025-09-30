import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "requests",
  initialState: {
    requests: [],
    loading: false,
    error: null
  },
  reducers: {
    addRequests: (state, action) => {
      state.requests = action.payload;
      state.loading = false;
      state.error = null;
    },
    removeRequest: (state, action) => {
      state.requests = state.requests.filter((r) => r._id !== action.payload);
    },
    setRequestLoading: (state, action) => {
      state.loading = action.payload;
    },
    setRequestError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { addRequests, removeRequest, setRequestLoading, setRequestError } = requestSlice.actions;
export default requestSlice.reducer;