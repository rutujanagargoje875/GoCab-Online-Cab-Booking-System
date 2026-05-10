import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import db_elements from "./connect/getENV.js";

import landingTest from "./routes/landingTest.js";
import pathGetter from "./routes/pathGetter.js";
import cabGetter from "./routes/cabGetter.js";
import userBooking from "./routes/userBooking.js";
import allCabBooking from "./routes/allCabBookings.js";
import addCab from "./routes/addCabs.js";
import getCabs from "./routes/fetchCabs.js";
import userRoutes from "./routes/userRoutes.js";

// Security best practice
mongoose.set("strictQuery", true);

const app = express();

// app.use(cors({ origin: "http://localhost:3001" }));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://192.168.0.107:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const connectDatabase = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/cab");
    console.log("✅ MongoDB connected");

    app.use("/test", landingTest);
    app.use("/path", pathGetter);
    app.use("/cab", cabGetter);
    app.use("/user", userBooking);
    app.use("/allcab", allCabBooking);
    app.use("/addCab", addCab);
    app.use("/cabs", getCabs);
    app.use("/register", userRoutes);

    app.listen(5000, () => {
      console.log("🚀 Server running on port 5000");
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

connectDatabase();
