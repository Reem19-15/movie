import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { firebaseAuth } from "../utils/firebase-config"; // Ensure this path is correct

// Define your backend URL using an environment variable.
// This should match the `FRONTEND_URL` in your backend's `.env` during development
// and your deployed backend URL in production.
const BACKEND_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_URL || "http://localhost:5000";

// Async thunk to fetch user's liked movies from the backend
export const getUsersLikedMovies = createAsyncThunk(
  "Netflix/getLikedMovies", // Unique action type prefix for this thunk
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
      return response.data; // This data will be the payload for the fulfilled action
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
  "Netflix/toggleLikedMovie", // Unique action type prefix for this thunk
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
          { movieId, mediaType, title, poster_path, release_date }, // Data to send in the request body
          { headers: { Authorization: `Bearer ${idToken}` } } // Headers for authentication
        );
      }
      // After successfully toggling, re-fetch the entire list of liked movies
      // This ensures the 'My List' page (and any other components displaying liked movies)
      // is immediately updated.
      dispatch(getUsersLikedMovies());
      return null; // No specific payload needed for the toggle itself
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
        state.status = "loading"; // Optional: Set a loading state
      })
      .addCase(getUsersLikedMovies.fulfilled, (state, action) => {
        state.status = "succeeded"; // Optional: Set a success state
        state.movies = action.payload; // Update the movies array with the fetched liked movies
      })
      .addCase(getUsersLikedMovies.rejected, (state, action) => {
        state.status = "failed"; // Optional: Set an error state
        state.error = action.payload; // Optional: Store the error message
        state.movies = []; // Clear the liked movies on error
      })
      // Handle the state changes for the toggleLikedMovie thunk (you might not need to update state here directly
      // as getUsersLikedMovies is dispatched after toggling)
      .addCase(toggleLikedMovie.pending, (state) => {
        // Optional: Indicate that the toggle action is in progress
      })
      .addCase(toggleLikedMovie.fulfilled, (state, action) => {
        // Optional: Indicate that the toggle action was successful
      })
      .addCase(toggleLikedMovie.rejected, (state, action) => {
        // Optional: Indicate that the toggle action failed and store the error
        state.error = action.payload;
      });
  },
});

export const { setBannerData, setImageURL, setLikedMovies } =
  movieoSlice.actions;

export default movieoSlice.reducer;
