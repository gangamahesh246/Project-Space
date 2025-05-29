import { configureStore } from "@reduxjs/toolkit";
import examReducer from "./slices/BasicInfoSlice";

const store = configureStore({
  reducer: {
    exam: examReducer,
  },
});

export default store;