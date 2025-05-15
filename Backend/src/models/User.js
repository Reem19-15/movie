const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },
    likedMovies: [
      // An array to store the movies liked by this user
      {
        movieId: {
          type: Number,
          required: true,
        },
        mediaType: {
          type: String,
          required: true,
        },
        // Store additional details to avoid repeated TMDb API calls for displaying the list
        title: String,
        poster_path: String,
        release_date: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
