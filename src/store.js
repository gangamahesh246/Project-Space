import { configureStore } from "@reduxjs/toolkit";
import examReducer from "./slices/ExamSlice";
import adminReducer from "./slices/adminAuthSlice";
import studentReducer from "./slices/studentAuthSlice";

const store = configureStore({
  reducer: {
    exam: examReducer,
    login: adminReducer,
    student: studentReducer,
  },
});

export default store;