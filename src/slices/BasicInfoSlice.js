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
  schedule: {},  
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
    setSchedule(state, action) {
      state.schedule = { ...state.schedule, ...action.payload };
    }
  },
});

export const {
  setBasic,
  setQuestions,
  setSettings,
  setSchedule,
} = examSlice.actions;

export default examSlice.reducer;
