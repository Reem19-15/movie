// movieoSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// REMOVED: import axios from "axios";

import { firebaseDb } from "../utils/firebase-config"; // IMPORTED: Firebase Firestore instance
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore"; // IMPORTED: Firestore functions

// REMOVED: const BACKEND_URL, as it's no longer used

export const getUsersLikedMovies = createAsyncThunk(
  "movieo/getUsersLikedMovies",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const userId = user.firebaseUser?.uid;

      if (!userId) {
        console.warn(
          "No Firebase user found. Returning empty liked movies array."
        );
        return [];
      }

      const userDocRef = doc(firebaseDb, "users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        return userData.likedMovies || [];
      } else {
        console.log(
          `User document for ${userId} does not exist. No liked movies found.`
        );
        return [];
      }
    } catch (error) {
      console.error("Error fetching users liked movies from Firestore:", error);
      return rejectWithValue(error.message || "Failed to fetch liked movies.");
    }
  }
);

export const toggleLikedMovie = createAsyncThunk(
  "movieo/toggleLikedMovie",
  async (
    { movieId, mediaType, isLiked, title, poster_path, release_date },
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      const { user } = getState();
      const userId = user.firebaseUser?.uid;

      if (!userId) {
        return rejectWithValue("User not authenticated. Please log in.");
      }

      const userDocRef = doc(firebaseDb, "users", userId);
      const movieData = {
        movieId: movieId,
        mediaType: mediaType,
        title: title,
        poster_path: poster_path,
        release_date: release_date,
      };

      if (isLiked) {
        // If currently liked, remove it
        await updateDoc(userDocRef, {
          likedMovies: arrayRemove(movieData),
        });
        console.log(
          `Movie ID ${movieId} (${mediaType}) removed for user ${userId}`
        );
      } else {
        // If not liked, add it
        await setDoc(
          userDocRef,
          {
            likedMovies: arrayUnion(movieData),
          },
          { merge: true }
        ); // Use merge: true to avoid overwriting other fields
        console.log(
          `Movie ID ${movieId} (${mediaType}) added for user ${userId}`
        );
      }

      // After adding/removing, dispatch getUsersLikedMovies to update Redux state
      dispatch(getUsersLikedMovies());

      return { action: isLiked ? "removed" : "added", movieId, mediaType };
    } catch (error) {
      console.error("Error toggling liked movie in Firestore:", error);
      return rejectWithValue(error.message || "Failed to toggle liked movie.");
    }
  }
);

export const movieoSlice = createSlice({
  name: "Netflix", // Consider renaming this to "movieo" for consistency with your slice name
  initialState: {
    bannerData: [],
    imageURL: "",
    movies: [], // This will now store the liked movies from Firestore
    status: "idle", // Added status to track async operations
    error: null, // Added error to store potential errors
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
      // Reducers for getUsersLikedMovies
      .addCase(getUsersLikedMovies.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getUsersLikedMovies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.movies = action.payload; // Update liked movies from Firestore
      })
      .addCase(getUsersLikedMovies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.movies = []; // Clear liked movies on error
      })

      // Reducers for toggleLikedMovie (no direct state change here, as getUsersLikedMovies is dispatched)
      .addCase(toggleLikedMovie.pending, (state) => {
        // Optional: you can set a specific loading state for this action if needed
      })
      .addCase(toggleLikedMovie.fulfilled, (state, action) => {
        // The actual 'movies' array update happens via getUsersLikedMovies dispatch
      })
      .addCase(toggleLikedMovie.rejected, (state, action) => {
        state.error = action.payload; // Store error if the toggle operation fails
      });
  },
});

export const { setBannerData, setImageURL, setLikedMovies } =
  movieoSlice.actions;

export default movieoSlice.reducer;
