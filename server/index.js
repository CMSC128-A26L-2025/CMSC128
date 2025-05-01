import app from "./server.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5050;

// connect to MongoDB
mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("MongoDB Connected...");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// kill process when interrupted
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  process.exit();
});