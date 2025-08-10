import path from "path";
import { fileURLToPath } from "url";

import Movie from "../model/movieModel.js";
import Review from "../model/reviewModel.js";
import {
  createMovieValidation,
  editMovieValidation,
} from "../validation/movieValidation.js";
import { movieUploader } from "../utils/videoUploader.js";

// ES modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//! Get Request
export const allMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json({ status: 200, movies, message: "All movies" });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

export const singleMovie = async (req, res) => {
  const movieId = req.params.id;

  try {
    const movie = await Movie.findById(movieId).populate("actors director");
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    movie.views += 1;
    await movie.save();
    res
      .status(200)
      .json({ status: 200, movie, message: "Movie fetch successfully" });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

export const movieCategories = async (req, res) => {
  try {
    const categories = await Movie.distinct("category");

    const categoryImages = {};

    for (const category of categories) {
      const movies = await Movie.find({ category }).limit(4);
      const images = movies.map((movie) => movie.thumbnail).slice(0, 4);
      categoryImages[category] = images;
    }

    res.status(200).json(categoryImages);
  } catch (error) {
    console.error("Error fetching movie categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const topRatedMovies = async (req, res) => {
  const { limit } = req.query;
  try {
    const categories = await Movie.distinct("category");

    const topRatedMovies = {};

    for (const category of categories) {
      const movies = await Review.aggregate([
        {
          $lookup: {
            from: "movies",
            localField: "media",
            foreignField: "_id",
            as: "movieDetails",
          },
        },
        { $unwind: "$movieDetails" },
        { $match: { "movieDetails.category": category } },
        {
          $group: {
            _id: "$media",
            averageRating: { $avg: "$rating" },
            movieDetails: { $first: "$movieDetails" },
          },
        },
        { $sort: { averageRating: -1 } },
        { $limit: parseInt(limit) || 10 },
      ]);
      topRatedMovies[category] = movies.map((movie) => {
        if (limit) return movie.movieDetails.thumbnail;
        return {
          title: movie.movieDetails.title,
          averageRating: movie.averageRating,
          thumbnail: movie.movieDetails.thumbnail,
        };
      });
    }

    res.status(200).json({
      status: 200,
      message: "top rated movies fetch successfully",
      movies: topRatedMovies,
    });
  } catch (error) {
    console.error("Error fetching top-rated movies:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const trendingMovies = async (req, res) => {
  try {
    const currentDate = new Date();

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const recentMovies = await Movie.aggregate([
      // {
      //     $match: {
      //         publish_date: { $gte: new Date(currentDate.setDate(currentDate.getDate() - 60)) }
      //     }
      // },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "media",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$reviews.rating" },
        },
      },
      {
        $sort: { views: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          title: 1,
          views: 1,
          duration: 1,
          averageRating: 1,
          thumbnail: 1,
        },
      },
    ]);

    const totalMovies = await Movie.countDocuments({
      publish_date: {
        $gte: new Date(currentDate.setDate(currentDate.getDate() - 30)),
      },
    });
    const totalPages = Math.ceil(totalMovies / limit);

    res.status(200).json({
      status: 200,
      message: "Trending movies fetched successfully",
      movies: recentMovies,
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching recent movies:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const newReleased = async (req, res) => {
  try {
    const currentDate = new Date();

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const newReleasedMovies = await Movie.aggregate([
      {
        $match: {
          publish_date: { $lte: currentDate },
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "media",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$reviews.rating" },
        },
      },
      {
        $sort: { publish_date: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          title: 1,
          views: 1,
          duration: 1,
          averageRating: 1,
          thumbnail: 1,
          publish_date: 1,
        },
      },
    ]);

    const totalMovies = await Movie.countDocuments({
      publish_date: { $lte: currentDate },
    });
    const totalPages = Math.ceil(totalMovies / limit);

    res.status(200).json({
      status: 200,
      message: "New released movies fetched successfully",
      movies: newReleasedMovies,
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching new released movies:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const popularMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const popularMovies = await Movie.aggregate([
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "media",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$reviews.rating" },
        },
      },
      {
        $sort: { averageRating: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          title: 1,
          views: 1,
          duration: 1,
          averageRating: 1,
          thumbnail: 1,
          publish_date: 1,
        },
      },
    ]);

    const totalMovies = await Movie.countDocuments();
    const totalPages = Math.ceil(totalMovies / limit);

    res.status(200).json({
      status: 200,
      message: "Popular movies fetched successfully",
      movies: popularMovies,
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const getMoviesByGenre = async (req, res) => {
  const { genre } = req.params;
  const { topRated } = req.query;

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const sortCriteria =
      topRated === "true" ? { rate: -1 } : { publish_date: -1 };

    const moviesByGenre = await Movie.aggregate([
      { $match: { category: genre } },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "media",
          as: "reviews",
        },
      },
      {
        $addFields: {
          rate: { $avg: "$reviews.rating" },
        },
      },
      {
        $sort: sortCriteria,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          title: 1,
          views: 1,
          duration: 1,
          rate: 1,
          thumbnail: 1,
        },
      },
    ]);

    const totalMovies = await Movie.countDocuments({ category: genre });
    const totalPages = Math.ceil(totalMovies / limit);

    res.status(200).json({
      status: 200,
      message: "Movies fetched successfully",
      movies: moviesByGenre,
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching movies by genre:", error);
    res.status(500).send({ status: 500, message: "Internal Server Error" });
  }
};

//! Post Request
export const createMovie = [
  movieUploader,
  createMovieValidation,
  async (req, res) => {
    try {
      const newMovie = await Movie.create(req.body);

      res.status(201).json({
        status: 201,
        message: "Movie created successfully",
        movie: newMovie,
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  },
];

export const downloadMovie = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ status: 400, message: "URL is required" });
  }

  try {
    const file = path.join(__dirname, "..", `public`, "videos", url);
    // console.log(file)
    res.download(file);
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "An error occurred while downloading the episode",
      error: err.message,
    });
  }
};

//! Put Request
export const updateMovie = [
  movieUploader,
  editMovieValidation,
  async (req, res) => {
    const movieId = req.params.id;

    try {
      const movie = await Movie.findById(movieId);
      if (!movie) {
        return res
          .status(404)
          .json({ status: 404, message: "Movie not found" });
      }

      const updatedMovie = await Movie.findByIdAndUpdate(movieId, req.body, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({
        status: 200,
        message: "Movie updated successfully",
        movie: updatedMovie,
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  },
];

//! Delete Request
export const deleteMovie = async (req, res) => {
  const movieId = req.params.id;

  try {
    const movie = await Movie.findByIdAndDelete(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res
      .status(200)
      .json({ status: 200, message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};
