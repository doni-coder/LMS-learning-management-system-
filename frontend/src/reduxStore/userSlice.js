import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  userRole: null,
  tempUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.userRole = action.payload.userRole;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.userRole = null;
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
    },
    setUserRole(state, action) {
      state.userRole = action.payload;
    },
    setTempUser(state, action) {
      state.tempUser = action.payload;
    },
  },
});

export const { login, logout, updateUser, setTempUser, setUserRole } = userSlice.actions;
export default userSlice.reducer;
