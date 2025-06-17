import { createSlice } from "@reduxjs/toolkit";
const storedAuth = JSON.parse(localStorage.getItem("auth"));

const initialState = {
  token: storedAuth?.token || null,
  isAdmin: storedAuth?.isAdmin || null,
  user: storedAuth?.token || false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.isAdmin = action.payload.isAdmin;
      state.user = action.payload.user;

      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.token = null;
      state.isAdmin = false;
      state.user = null;

      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
