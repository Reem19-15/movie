const admin = require("firebase-admin");
const path = require("path");

const serviceAccountPath = path.resolve(
  __dirname,
  "..",
  "..",
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH
);

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
