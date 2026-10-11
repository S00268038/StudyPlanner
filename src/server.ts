import "dotenv/config"; // must be first, loads .env
import mongoose from "mongoose";
import app from "./app.js";

const start = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log("Connected to MongoDB");
  app.listen(process.env.PORT || 3000, () => console.log("Server running"));
};

start();
