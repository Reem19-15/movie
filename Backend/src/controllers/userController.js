const User = require("../models/User");

const getLikedMovies = async (req, res) => {
  try {
    const user = await User.findById(req.user._id); // Find the user by their MongoDB _id

    if (user) {
      res.json(user.likedMovies);
    } else {
      res.status(404).json({ message: "User not found in database." });
    }
  } catch (error) {
    console.error("Error getting liked movies:", error);
    res
      .status(500)
      .json({ message: "Server Error. Could not retrieve liked movies." });
  }
};

const addLikedMovie = async (req, res) => {
  const { movieId, mediaType, title, poster_path, release_date } = req.body;

  // Basic validation for required fields
  if (!movieId || !mediaType) {
    return res
      .status(400)
      .json({ message: "Missing required movie ID or media type." });
  }

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Check if the movie is already present in the user's liked list
      const isMovieLiked = user.likedMovies.some(
        (movie) => movie.movieId === movieId && movie.mediaType === mediaType
      );

      if (isMovieLiked) {
        return res
          .status(400)
          .json({ message: "Movie is already in your liked list." });
      }

      // Add the new movie object to the likedMovies array
      user.likedMovies.push({
        movieId,
        mediaType,
        title,
        poster_path,
        release_date,
      });
      await user.save(); // Save the updated user document to the database
      res.status(201).json(user.likedMovies);
    } else {
      res.status(404).json({ message: "User not found in database." });
    }
  } catch (error) {
    console.error("Error adding liked movie:", error);
    res
      .status(500)
      .json({ message: "Server Error. Could not add movie to list." });
  }
};

const removeLikedMovie = async (req, res) => {
  // Destructure movie ID and media type from URL parameters
  const { movieId, mediaType } = req.params;

  // Basic validation for required parameters
  if (!movieId || !mediaType) {
    return res.status(400).json({
      message: "Missing required movie ID or media type in parameters.",
    });
  }

  try {
    const user = await User.findById(req.user._id);
    if (user) {
      // Filter out the movie to be removed from the likedMovies array
      user.likedMovies = user.likedMovies.filter(
        (movie) =>
          !(
            movie.movieId === parseInt(movieId) && movie.mediaType === mediaType
          )
      );
      await user.save(); // Save the updated user document
      res.json({
        message: "Movie removed successfully from list.",
        likedMovies: user.likedMovies,
      });
    } else {
      res.status(404).json({ message: "User not found in database." });
    }
  } catch (error) {
    console.error("Error removing liked movie:", error);
    res
      .status(500)
      .json({ message: "Server Error. Could not remove movie from list." });
  }
};

module.exports = { getLikedMovies, addLikedMovie, removeLikedMovie };
