import { createSlice } from "@reduxjs/toolkit";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

const initialState = {
  user: getStoredUser(),
  token: localStorage.getItem("token") || null,
  loading: false,
  isLoggedIn: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;

      // persist login
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem(
        "user",
        JSON.stringify(action.payload.user)
      );
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;

      // remove only auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setLoading, setCredentials, logout } =
  authSlice.actions;
export default authSlice.reducer;
