import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { user: null, loading: true, error: null },
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    removeUser: (state, action) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { addUser, removeUser, setLoading, setError } = userSlice.actions;

export default userSlice.reducer;