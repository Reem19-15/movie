require("dotenv").config(); // Load environment variables FIRST

console.log(
  "FIREBASE_SERVICE_ACCOUNT_KEY_PATH from .env:",
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH
);
console.log("MONGO_URI from .env:", process.env.MONGO_URI);
console.log("PORT from .env:", process.env.PORT);
console.log("FRONTEND_URL from .env:", process.env.FRONTEND_URL);

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user");

connectDB();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Movie Recommendation App Backend API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
