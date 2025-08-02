import { configureStore } from "@reduxjs/toolkit";
import examReducer from "./slices/ExamSlice";
import adminReducer from "./slices/adminAuthSlice";
import studentReducer from "./slices/studentAuthSlice";
import studentRankReducer from "./slices/StudentRankSlice";

const store = configureStore({
  reducer: {
    exam: examReducer,
    login: adminReducer,
    student: studentReducer,
    studentRank: studentRankReducer,
  },
});

export default store;