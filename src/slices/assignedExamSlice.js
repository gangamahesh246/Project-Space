import { createSlice } from "@reduxjs/toolkit";

const assignedExamSlice = createSlice({
  name: "assignedExam",
  initialState: {
    exams: [],
    hasNew: false,
    assignedBy: ""
  },
  reducers: {
    addAssignedExam: (state, action) => {
      state.exams.push(action.payload);
      state.hasNew = true;
      state.assignedBy = action.payload.assignedBy;
    },
    clearNewBadge: (state) => {
      state.hasNew = false;
    },
  },
});

export const { addAssignedExam, clearNewBadge } = assignedExamSlice.actions;
export default assignedExamSlice.reducer;
