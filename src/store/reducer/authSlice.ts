import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  auth: any | null; // replace `any` with your actual user type
}

const initialState: AuthState = {
  auth: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<any>) => {
      state.auth = action.payload;
    },
    logout: (state) => {
      state.auth = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

// ✅ Export the reducer function, not the slice
export default authSlice.reducer;
