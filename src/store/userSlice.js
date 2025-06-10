import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null, // chứa thông tin user (username, email, avatarUrl,...)
  accessToken: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
    },
    setUserInfo: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { loginSuccess, logout, setUserInfo } = userSlice.actions;
export default userSlice.reducer;
