import { configureStore } from "@reduxjs/toolkit";
import examReducer from "./slices/ExamSlice";

const store = configureStore({
  reducer: {
    exam: examReducer,
  },
});

export default store;