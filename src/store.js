import { configureStore } from "@reduxjs/toolkit";
import examReducer from "./slices/ExamSlice";
import loginReducer from "./slices/authSlice"

const store = configureStore({
  reducer: {
    exam: examReducer,
    login: loginReducer
  },
});

export default store;