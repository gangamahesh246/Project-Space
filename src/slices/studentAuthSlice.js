import { createSlice } from "@reduxjs/toolkit";

const storedStudentAuth = JSON.parse(localStorage.getItem("studentAuth"));

const initialState = {
  token: storedStudentAuth?.token || null,
  isAdmin: false, 
  user: storedStudentAuth?.user || null,
};

const studentAuthSlice = createSlice({
  name: "studentAuth",
  initialState,
  reducers: {
    loginStudent: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;

      localStorage.setItem(
        "studentAuth",
        JSON.stringify({
          token: action.payload.token,
          user: action.payload.user,
        })
      );
    },

    logoutStudent: (state) => {
      state.token = null;
      state.user = null;

      localStorage.removeItem("studentAuth");
    },
  },
});

export const { loginStudent, logoutStudent } = studentAuthSlice.actions;
export default studentAuthSlice.reducer;
