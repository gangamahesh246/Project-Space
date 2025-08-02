import { createSlice } from "@reduxjs/toolkit";

const studentRankSlice = createSlice({
  name: "studentRank",
  initialState: {
    rank: null,
  },
  reducers: {
    setStudentRank: (state, action) => {
      state.rank = action.payload;
    },
  },
});

export const { setStudentRank } = studentRankSlice.actions;
export default studentRankSlice.reducer;
