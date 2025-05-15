import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  firebaseUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.firebaseUser = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
