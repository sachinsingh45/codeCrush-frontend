import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
  name: "connection",
  initialState: {
    connections: [],
    loading: false,
    error: null
  },
  reducers: {
    addConnections: (state, action) => {
      state.connections = action.payload;
      state.loading = false;
      state.error = null;
    },
    removeConnections: (state) => {
      state.connections = [];
      state.loading = false;
      state.error = null;
    },
    setConnectionLoading: (state, action) => {
      state.loading = action.payload;
    },
    setConnectionError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { addConnections, removeConnections, setConnectionLoading, setConnectionError } = connectionSlice.actions;

export default connectionSlice.reducer;