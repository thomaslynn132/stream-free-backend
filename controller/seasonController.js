import { isValidObjectId } from "mongoose";
import Seasons from "../model/seasonModel.js";
import Series from "../model/seriesModel.js";
import { editSeasonValidation } from "../validation/seasonValidation.js";

//! Get Request
export async function getSeason(req, res) {
  try {
    const season = await Seasons.findById(req.params.id).populate("episodes");
    res.status(200).json({
      status: 200,
      message: "fetch data successfully",
      data: {
        season,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 404,
      message: "fail",
      message: err,
    });
  }
}

export async function getSeasonsBySeries(req, res) {
  const { seriesId } = req.params;

  if (!isValidObjectId(seriesId))
    return res.status(400).json({ status: 400, message: "Invalid ID" });

  try {
    const seasons = await Seasons.find({ series: seriesId }).populate(
      "episodes"
    );
    res.status(200).json({
      status: 200,
      message: "fetch data successfully",
      seasons,
    });
  } catch (err) {
    res.status(404).json({
      status: 404,
      message: "fail",
      message: err,
    });
  }
}

//! Post Request
export async function createSeason(req, res) {
  try {
    const series = await Series.findById(req.body.series);
    if (!series)
      return res.status(404).json({ status: 404, message: "series not found" });

    if (!req.body.seasonNumber) {
      const isSeason = await Seasons.find({ series: req.body.series });
      req.body.seasonNumber = isSeason.length + 1;
    }

    const newSeason = await Seasons.create(req.body);

    series.seasons.push(newSeason._id);
    await series.save();

    res.status(201).json({
      status: 200,
      message: "season created successfully",
      data: {
        season: newSeason,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 404,
      message: "fail",
      message: err,
    });
  }
}

export const updateSeason = [
  editSeasonValidation,
  async (req, res) => {
    try {
      const season = await Seasons.findById(req.params.id);
      if (!season) {
        return res
          .status(404)
          .json({ status: 404, message: "Season not found" });
      }

      const updatedSeason = await Seasons.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(200).json({
        status: 200,
        message: "Season updated successfully",
        season: updatedSeason,
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: "Failed to update season",
        error: err.message,
      });
    }
  },
];

//! Delete Request
export async function deleteSeason(req, res) {
  try {
    const season = await Seasons.findByIdAndDelete(req.params.id);
    if (!season) return res.status(404).json({ message: "Season not found" });

    //! find series and delete season from seasons field in series
    const series = await Series.findById(season.series);
    series.seasons = series.seasons.filter(
      (seasonId) => seasonId.toString() !== season._id.toString()
    );
    await series.save();

    res.status(200).json({
      status: 200,
      message: "season deleted successfully",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 404,
      message: "fail",
      message: err,
    });
  }
}
