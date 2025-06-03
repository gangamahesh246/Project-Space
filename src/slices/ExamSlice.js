import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  basicInfo: {
    title: "",
    category: "",
    coverPreview: "/exam.jpg",
    description: "",
  },
  questions: [],

  settings: {},
};


const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    setBasic(state, action) {
      state.basicInfo = { ...state.basicInfo, ...action.payload };
    },
    setQuestions(state, action) {
      state.questions = action.payload;
    },
    setSettings(state, action) {
      state.settings = { ...state.settings, ...action.payload };
    },
    resetExamState: () => initialState,
  },
});

export const {
  setBasic,
  setQuestions,
  setSettings,
  resetExamState,
} = examSlice.actions;

export default examSlice.reducer;
