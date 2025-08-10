import express from "express";
import dotEnv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDb from "./config/db.js";

//! Import Routes
import userRoutes from "./router/userRoutes.js";
import movieRoutes from "./router/movieRoutes.js";
import seriesRoutes from "./router/seriesRoutes.js";
import actorRoutes from "./router/actorRoutes.js";
import directorRoutes from "./router/directorRoutes.js";
import reviewRoutes from "./router/reviewRoutes.js";
import seasonRoutes from "./router/seasonRoutes.js";
import episodeRoutes from "./router/episodeRoutes.js";
import supportRoutes from "./router/supportRoutes.js";
import likeRoutes from "./router/likeRoutes.js";
import searchRoutes from "./router/searchRoutes.js";

//! ES modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//! Config Env
dotEnv.config({ path: "./config/config.env" });

//! Connect to Database
connectDb();

//! cors options
const corsOptions = {
  origin: ["http://localhost:3000", "https://streamvibe-live.liara.run"],
  credentials: true,
};

const app = express()
  .use(express.json())
  .use(cors(corsOptions))
  .use(express.urlencoded({ extended: true }))
  .use(cookieParser());

//! Static Folder
app.use("/public", express.static(path.join(__dirname, "public", "actor")));
app.use("/public", express.static(path.join(__dirname, "public", "cover")));
app.use("/public", express.static(path.join(__dirname, "public", "director")));
app.use("/public", express.static(path.join(__dirname, "public", "profile")));
app.use("/public", express.static(path.join(__dirname, "public", "thumbnail")));
app.use("/public", express.static(path.join(__dirname, "public", "trailer")));
app.use("/public", express.static(path.join(__dirname, "public", "videos")));

//! Routes
app.use("/api/user", userRoutes);
app.use("/api/movie", movieRoutes);
app.use("/api/series", seriesRoutes);
app.use("/api/actor", actorRoutes);
app.use("/api/director", directorRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/season", seasonRoutes);
app.use("/api/episode", episodeRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/like", likeRoutes);
app.use("/api/search", searchRoutes);

app.listen(process.env.PORT, (err) => {
  if (err) return console.log(err);
  console.log(`Server is running on port ${process.env.PORT}`);
});
