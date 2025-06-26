import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionReducer from "./conectionSlice";
import requestReducer from "./requestSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connections: connectionReducer,
    requests: requestReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

// Debug logging for store state changes
appStore.subscribe(() => {
  const state = appStore.getState();
  console.log('Redux state changed:', state);
});

export default appStore;