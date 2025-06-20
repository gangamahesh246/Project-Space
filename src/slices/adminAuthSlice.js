import { createSlice } from "@reduxjs/toolkit";

const storedAuth = JSON.parse(localStorage.getItem("auth"));

const initialState = {
  token: storedAuth?.token || null,
  isAdmin: storedAuth?.isAdmin || false,
  user: storedAuth?.user || null,
};

const authSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.isAdmin = action.payload.isAdmin;
      state.user = action.payload.user; 

      localStorage.setItem(
        "auth",
        JSON.stringify({
          token: action.payload.token,
          user: action.payload.user,
          isAdmin: action.payload.isAdmin,
        })
      );
    },

    logout: (state) => {
      state.token = null;
      state.isAdmin = false;
      state.user = null;

      localStorage.removeItem("auth");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
