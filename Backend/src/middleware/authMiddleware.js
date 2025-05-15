const admin = require("../config/firebase");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token from the 'Bearer TOKEN' string
      token = req.headers.authorization.split(" ")[1];

      // Verify the Firebase ID token using the Firebase Admin SDK
      const decodedToken = await admin.auth().verifyIdToken(token);

      // Find or create the user in your MongoDB database based on the Firebase UID
      let user = await User.findOne({ firebaseUid: decodedToken.uid });

      // If the user doesn't exist in your database, create a new entry for them
      if (!user) {
        user = await User.create({ firebaseUid: decodedToken.uid });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(
        "Error verifying Firebase token or finding/creating user:",
        error.message
      );

      res
        .status(401)
        .json({ message: "Not authorized, token failed or invalid" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

module.exports = protect;
