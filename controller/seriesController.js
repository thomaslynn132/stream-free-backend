import Review from "../model/reviewModel.js";
import Series from "../model/seriesModel.js";
import Episodes from "../model/episodeModel.js";
import { seriesUploader } from "../utils/videoUploader.js";
import {
  createSeriesValidation,
  editSeriesValidation,
} from "../validation/seriesValidation.js";

export async function getAllSeries(req, res) {
  try {
    const series = await Series.find().populate("director seasons actors");
    res.status(200).json({
      status: "success",
      total: series.length,
      series,
    });
  } catch (err) {
    res.status(500).json({
      status: "500",
      message: err,
    });
  }
}

export async function singleSeries(req, res) {
  const seriesId = req.params.id;

  try {
    const series = await Series.findById(seriesId)
      .populate("director actors")
      .populate({
        path: "seasons",
        model: "Seasons",
        populate: { path: "episodes", model: "Episodes" },
      });
    if (!series)
      return res.status(404).json({ status: 404, message: "Series not found" });

    series.views += 1;
    await series.save();

    res
      .status(200)
      .json({ status: 200, series, message: "Series fetch successfully" });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
}

export async function getSeries(req, res) {
  try {
    const series = await Series.findById(req.params.id)
      .populate({
        path: "director",
        select: "fullName birthPlace directorId profile",
      })
      .populate({
        path: "actors",
        select: "actorId profile fullName",
      });

    if (!series)
      return res.status(404).json({ status: 404, message: "Series not found" });

    // Fetch episodes where the series field matches the series' ObjectId
    const episodes = await Episodes.find({ series: req.params.id }).select(
      "seasonNumber episodeNumber pictures"
    );

    // Group pictures by season and episode number
    const groupedPictures = episodes.reduce((acc, episode) => {
      if (!acc[episode.seasonNumber]) {
        acc[episode.seasonNumber] = {};
      }
      if (!acc[episode.seasonNumber][episode.episodeNumber]) {
        acc[episode.seasonNumber][episode.episodeNumber] = [];
      }
      acc[episode.seasonNumber][episode.episodeNumber].push(
        ...episode.pictures
      );
      return acc;
    }, {});

    series.views += 1;
    await series.save();

    res.status(200).json({
      status: 200,
      message: "Series fetched successfully",
      series,
      pictures: groupedPictures, // Include the grouped pictures of the episodes
    });
  } catch (err) {
    res.status(500).json({
      status: "500",
      message: err,
    });
  }
}

export async function seriesCategories(req, res) {
  try {
    const categories = await Series.distinct("category");

    const categoryImages = {};

    for (const category of categories) {
      const series = await Series.find({ category }).limit(4);
      const images = series.map((series) => series.thumbnail).slice(0, 4);
      categoryImages[category] = images;
    }

    res.status(200).json({
      status: 200,
      message: "series categories fetch successfully",
      categories: categoryImages,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
}

export async function topRatedSeries(req, res) {
  const { limit } = req.query;
  try {
    const categories = await Series.distinct("category");
    const topRatedSeries = {};

    for (const category of categories) {
      const series = await Review.aggregate([
        {
          $lookup: {
            from: "series",
            localField: "media",
            foreignField: "_id",
            as: "seriesDetails",
          },
        },
        { $unwind: "$seriesDetails" },
        { $match: { "seriesDetails.category": category } },
        {
          $group: {
            _id: "$media",
            averageRating: { $avg: "$rating" },
            seriesDetails: { $first: "$seriesDetails" },
          },
        },
        { $sort: { averageRating: -1 } },
        { $limit: parseInt(limit) || 10 },
      ]);
      topRatedSeries[category] = series.map((series) => {
        if (limit) return series.seriesDetails.thumbnail;
        return {
          title: series.seriesDetails.title,
          averageRating: series.averageRating,
          thumbnail: series.seriesDetails.thumbnail,
        };
      });
    }

    res.status(200).json({
      status: 200,
      message: "Top rated series fetched successfully",
      series: topRatedSeries,
    });
  } catch (error) {
    console.error("Error fetching top-rated series:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function trendingSeries(req, res) {
  try {
    const currentDate = new Date();

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const recentSeries = await Series.aggregate([
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
        $lookup: {
          from: "seasons",
          localField: "_id",
          foreignField: "series",
          as: "seasons",
        },
      },
      {
        $addFields: {
          totalEpisodes: {
            $sum: {
              $map: {
                input: "$seasons",
                as: "season",
                in: { $size: "$$season.episodes" },
              },
            },
          },
        },
      },
      {
        $project: {
          title: 1,
          views: 1,
          totalEpisodes: 1,
          averageRating: 1,
          thumbnail: 1,
        },
      },
    ]);

    const totalSeries = await Series.countDocuments({
      publish_date: {
        $gte: new Date(currentDate.setDate(currentDate.getDate() - 30)),
      },
    });
    const totalPages = Math.ceil(totalSeries / limit);

    res.status(200).json({
      status: 200,
      message: "Trending series fetched successfully",
      series: recentSeries,
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching recent series:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
}

export async function newReleasedSeries(req, res) {
  try {
    const currentDate = new Date();

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const newReleasedSeries = await Series.aggregate([
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
        $lookup: {
          from: "seasons",
          localField: "_id",
          foreignField: "series",
          as: "seasons",
        },
      },
      {
        $addFields: {
          totalEpisodes: {
            $sum: {
              $map: {
                input: "$seasons",
                as: "season",
                in: { $size: "$$season.episodes" },
              },
            },
          },
        },
      },
      {
        $project: {
          title: 1,
          views: 1,
          totalEpisodes: 1,
          averageRating: 1,
          thumbnail: 1,
          publish_date: 1,
        },
      },
    ]);

    const totalSeries = await Series.countDocuments({
      publish_date: { $lte: currentDate },
    });
    const totalPages = Math.ceil(totalSeries / limit);

    res.status(200).json({
      status: 200,
      message: "New released series fetched successfully",
      series: newReleasedSeries,
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching new released series:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
}

export async function popularSeries(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const popularSeries = await Series.aggregate([
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
        $lookup: {
          from: "seasons",
          localField: "_id",
          foreignField: "series",
          as: "seasons",
        },
      },
      {
        $addFields: {
          totalEpisodes: {
            $sum: {
              $map: {
                input: "$seasons",
                as: "season",
                in: { $size: "$$season.episodes" },
              },
            },
          },
        },
      },
      {
        $project: {
          title: 1,
          views: 1,
          totalEpisodes: 1,
          averageRating: 1,
          thumbnail: 1,
          publish_date: 1,
        },
      },
    ]);

    const totalSeries = await Series.countDocuments();
    const totalPages = Math.ceil(totalSeries / limit);

    res.status(200).json({
      status: 200,
      message: "Popular series fetched successfully",
      series: popularSeries,
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching popular series:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
}

export async function getSeriesByGenre(req, res) {
  const { genre } = req.params;
  const { topRated } = req.query;

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const sortCriteria =
      topRated === "true" ? { rate: -1 } : { publish_date: -1 };

    const seriesByGenre = await Series.aggregate([
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
        $lookup: {
          from: "seasons",
          localField: "_id",
          foreignField: "series",
          as: "seasons",
        },
      },
      {
        $addFields: {
          totalEpisodes: {
            $sum: {
              $map: {
                input: "$seasons",
                as: "season",
                in: { $size: "$$season.episodes" },
              },
            },
          },
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
          totalEpisodes: 1,
          duration: 1,
          rate: 1,
          thumbnail: 1,
        },
      },
    ]);

    const totalSeries = await Series.countDocuments({ category: genre });
    const totalPages = Math.ceil(totalSeries / limit);

    res.status(200).json({
      status: 200,
      message: "Series fetched successfully",
      series: seriesByGenre,
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching series by genre:", error);
    res.status(500).send({ status: 500, message: "Internal Server Error" });
  }
}

//! Post Request
export const createSeries = [
  seriesUploader,
  createSeriesValidation,
  async (req, res) => {
    try {
      const newSeries = await Series.create(req.body);
      res.status(201).json({
        status: "201",
        series: newSeries,
      });
    } catch (err) {
      res.status(500).json({
        status: "500",
        message: err,
      });
    }
  },
];

export const updateSeries = [
  seriesUploader,
  editSeriesValidation,
  async (req, res) => {
    try {
      const series = await Series.findById(req.params.id);
      if (!series) {
        return res
          .status(404)
          .json({ status: 404, message: "Series not found" });
      }

      const updatedSeries = await Series.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(200).json({
        status: 200,
        message: "Series updated successfully",
        series: updatedSeries,
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: err.message,
      });
    }
  },
];

export async function deleteSeries(req, res) {
  try {
    const series = await Series.findByIdAndDelete(req.params.id);
    if (!series)
      return res.status(404).json({ status: 404, message: "Series not found" });

    //! must delete all episodes and season in the series

    res.status(200).json({
      status: "200",
      message: "Series deleted successfully",
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: "500",
      message: err,
    });
  }
}
