import { Schema, model } from "mongoose";

const seasonModel = Schema({
  series: {
    type: Schema.Types.ObjectId,
    required: [true, "Series is required"],
    ref: "Series",
  },
  //! must change to default and check season data base for seasonNumber ...
  seasonNumber: {
    type: Number,
    required: [true, "Season number is required"],
  },
  episodes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Episodes",
      // type: String
    },
  ],
});

export default model("Seasons", seasonModel);

// Season
//     .findOne({ seasonNumber: 1 })
//     .populate('episodes')
//     .exec(function (err, season) {
//         if (err) return handleError(err);
//         console.log('The episodes are %s', season.episodes);
//     });
