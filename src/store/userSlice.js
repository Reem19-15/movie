// your-frontend-app/src/store/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    firebaseUser: null, // Will hold the Firebase user object (or null)
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // Action to set the Firebase user data
    setFirebaseUser: (state, action) => {
      state.firebaseUser = action.payload; // `action.payload` will be the Firebase user object (or null)
      state.status = "succeeded";
      state.error = null;
    },
    setLoading: (state) => {
      state.status = "loading";
    },
    setError: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    clearUser: (state) => {
      state.firebaseUser = null;
      state.status = "idle";
      state.error = null;
    },
  },
});

// Export the action creators
export const { setFirebaseUser, setLoading, setError, clearUser } =
  userSlice.actions;

// Export the reducer for the Redux store
export default userSlice.reducer;
