import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import courseRoutes from "./routes/course.routes.js";
import { v2 as cloudinary } from 'cloudinary';
import fileUpload from "express-fileupload";
import userRoutes from "./routes/user.routes.js"
import adminRoutes from "./routes/admin.routes.js";
import cookieParser from "cookie-parser";
import { adminmiddleware } from "./middlewares/admin.mid.js";
import cors from "cors";
dotenv.config();


const app = express();

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

async function start() {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

//  ⬇️ Mount your routes *after* express.json()
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/admin" ,adminRoutes );
  cloudinary.config({ 
        cloud_name: process.env.cloud_name, 
        api_key: process.env.api_key, 
        api_secret: process.env.api_secret // Click 'View API Keys' above to copy your API secret
    });

start();
