import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import taskRoutes from "./routes/tasks.js";

//------------------------ VARIABLES ------------------------

const port = 3000;
const app = express(); // use Express.js framework to do XYZ



//------------------------ MIDDLEWARE ------------------------

app.use(express.json());
app.use(cors()); // allows API requests to be made from other locations


//------------------------ API ROUTES ------------------------

app.use("/", taskRoutes);

 
//------------------------ APP STARTUP ------------------------

// IIFE
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { autoIndex: false });
    console.log("✅ Database connected!");

    await mongoose.syncIndexes();
    console.log("✅ Indexes synced!");

    app.listen(port, () => {
      console.log(`✅ To Do App is live on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})(); 
