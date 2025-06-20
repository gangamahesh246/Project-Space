import { configureStore } from "@reduxjs/toolkit";
import examReducer from "./slices/ExamSlice";
import adminReducer from "./slices/adminAuthSlice";
import studentReducer from "./slices/studentAuthSlice";
import assignedExamReducer from "./slices/assignedExamSlice";

const store = configureStore({
  reducer: {
    exam: examReducer,
    login: adminReducer,
    student: studentReducer,
    assignedExam: assignedExamReducer
  },
});

export default store;