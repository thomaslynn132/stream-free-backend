import { isValidObjectId } from "mongoose";
import path from "path";
import Episode from "../model/episodeModel.js";
import Season from "../model/seasonModel.js";
import { episodeUploader } from "../utils/videoUploader.js";
import {
  createEpisodeValidation,
  editEpisodeValidation,
} from "../validation/episodeValidation.js";

//! Single Episode
export async function getEpisodeById(req, res) {
  try {
    const episode = await Episode.findById(req.params.id);
    if (!episode)
      return res
        .status(404)
        .json({ status: 404, message: "Episode not found" });

    res.status(200).json({
      status: 200,
      message: "fetch data successfully",
      episode,
    });
  } catch (err) {
    res.status(404).json({
      status: 404,
      message: "fail",
      error: err,
    });
  }
}

export async function getEpisodeByEpisodeNumber(req, res) {
  const { series, season, episodeNumber } = req.params;

  if (!isValidObjectId(series)) {
    return res.status(400).json({ status: 400, message: "Invalid series ID" });
  }

  if (isNaN(season) || isNaN(episodeNumber)) {
    return res.status(400).json({
      status: 400,
      message: "Season number and episode number must be valid numbers",
    });
  }

  try {
    const episode = await Episode.findOne({
      series,
      seasonNumber: parseInt(season, 10),
      episodeNumber: parseInt(episodeNumber, 10),
    })
      .populate({
        path: "series",
        select:
          "title director release_date genres rotten_rating imdb_rating actors",
        populate: {
          path: "director actors",
          select: "directorId actorId fullName profile birthPlace",
        },
      })
      .select("title files pictures");

    if (!episode) {
      return res
        .status(404)
        .json({ status: 404, message: "Episode not found" });
    }

    res.status(200).json({
      status: 200,
      message: "Episode fetched successfully",
      episode,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "An error occurred while fetching the episode",
      error: err.message,
    });
  }
}

export const createEpisode = [
  episodeUploader,
  createEpisodeValidation,
  async (req, res) => {
    //! must send seriesTitle in the body
    try {
      if (req.files.pictures) {
        const pictureUrls = req.files.pictures.map(
          (picture) => picture.filename
        );
        req.body.pictures = pictureUrls;
      } else
        return res
          .status(400)
          .json({ status: 400, message: "Pictures are required" });

      // File handling for quality is now done in episodeValidation.js
      if (!req.files.files) {
        return res
          .status(400)
          .json({ status: 400, message: "Files are required" });
      }

      const season = await Season.findOne({
        series: req.body.series,
        seasonNumber: req.body.seasonNumber,
      });
      if (!season)
        return res
          .status(404)
          .json({ status: 404, message: "Season not found" });

      const newEpisode = await Episode.create(req.body);
      //! push episode id to season model
      season.episodes.push(newEpisode._id);
      await season.save();

      res.status(201).json({
        status: 201,
        message: "Episode created successfully",
        episode: newEpisode,
      });
    } catch (err) {
      res.status(400).json({
        status: 404,
        message: "fail",
        error: err,
      });
    }
  },
];

export const updateEpisode = [
  episodeUploader,
  editEpisodeValidation,
  async (req, res) => {
    try {
      const episode = await Episode.findById(req.params.id);
      if (!episode) {
        return res
          .status(404)
          .json({ status: 404, message: "Episode not found" });
      }

      const updatedEpisode = await Episode.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(200).json({
        status: 200,
        message: "Episode updated successfully",
        data: {
          episode: updatedEpisode,
        },
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: "Failed to update episode",
        error: err.message,
      });
    }
  },
];

export async function deleteEpisode(req, res) {
  try {
    const episode = await Episode.findByIdAndDelete(req.params.id);
    if (!episode)
      return res
        .status(404)
        .json({ status: 404, message: "Episode not found" });
    res.status(200).json({
      status: 204,
      message: "Episode deleted successfully",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 404,
      message: "fail",
      error: err,
    });
  }
}

export async function downloadEpisode(req, res) {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ status: 400, message: "URL is required" });
  }

  try {
    const file = path.join(process.cwd(), "public", "videos", url);
    res.download(file);
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "An error occurred while downloading the episode",
      error: err.message,
    });
  }
}
