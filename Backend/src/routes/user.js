const express = require("express");
const router = express.Router();
const {
  getLikedMovies,
  addLikedMovie,
  removeLikedMovie,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

// Define routes for getting and adding liked movies
router
  .route("/me/liked-movies")
  .get(protect, getLikedMovies)
  .post(protect, addLikedMovie);

// Define route for removing a liked movie
router
  .route("/me/liked-movies/:movieId/:mediaType")
  .delete(protect, removeLikedMovie);

module.exports = router;
