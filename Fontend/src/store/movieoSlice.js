import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { firebaseAuth } from "../utils/firebase-config";

const BACKEND_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_URL || "http://localhost:5000";

// Async thunk to fetch user's liked movies from the backend
export const getUsersLikedMovies = createAsyncThunk(
  "Netflix/getLikedMovies",
  async (_, { rejectWithValue }) => {
    try {
      const user = firebaseAuth.currentUser;
      if (!user) {
        return rejectWithValue("No authenticated user found. Please log in.");
      }
      const idToken = await user.getIdToken(); // Get the Firebase ID token

      const response = await axios.get(
        `${BACKEND_URL}/api/users/me/liked-movies`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`, // Send the ID token in the Authorization header
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching liked movies:",
        error.response?.data?.message || error.message
      );
      return rejectWithValue(error.response?.data?.message || error.message); // Reject with error message
    }
  }
);

// Async thunk to add or remove a movie from the liked list via the backend
export const toggleLikedMovie = createAsyncThunk(
  "Netflix/toggleLikedMovie",
  async (
    { movieId, mediaType, isLiked, title, poster_path, release_date },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const user = firebaseAuth.currentUser;
      if (!user) {
        return rejectWithValue(
          "No authenticated user found. Please log in to like/unlike movies."
        );
      }
      const idToken = await user.getIdToken();

      if (isLiked) {
        // If the movie is currently liked, send a DELETE request to remove it
        await axios.delete(
          `${BACKEND_URL}/api/users/me/liked-movies/${movieId}/${mediaType}`,
          {
            headers: { Authorization: `Bearer ${idToken}` },
          }
        );
      } else {
        // If the movie is not liked, send a POST request to add it
        await axios.post(
          `${BACKEND_URL}/api/users/me/liked-movies`,
          { movieId, mediaType, title, poster_path, release_date },
          { headers: { Authorization: `Bearer ${idToken}` } }
        );
      }

      dispatch(getUsersLikedMovies());
      return null;
    } catch (error) {
      console.error(
        "Error toggling liked movie:",
        error.response?.data?.message || error.message
      );
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const movieoSlice = createSlice({
  name: "Netflix",
  initialState: {
    bannerData: [],
    imageURL: "",
    movies: [], // To store the liked movies
  },
  reducers: {
    setBannerData: (state, action) => {
      state.bannerData = action.payload;
    },
    setImageURL: (state, action) => {
      state.imageURL = action.payload;
    },
    setLikedMovies: (state, action) => {
      state.movies = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle the state changes for the getUsersLikedMovies thunk
      .addCase(getUsersLikedMovies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUsersLikedMovies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.movies = action.payload;
      })
      .addCase(getUsersLikedMovies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.movies = [];
      })

      .addCase(toggleLikedMovie.pending, (state) => {})
      .addCase(toggleLikedMovie.fulfilled, (state, action) => {})
      .addCase(toggleLikedMovie.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setBannerData, setImageURL, setLikedMovies } =
  movieoSlice.actions;

export default movieoSlice.reducer;
