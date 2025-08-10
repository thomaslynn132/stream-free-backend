import { Schema, model } from "mongoose";

const reviewModel = Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  media: {
    type: Schema.Types.ObjectId,
    required: [true, "Media is required"],
  },
  text: {
    type: String,
    required: [true, "Text is required"],
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: 0,
    max: 5,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default model("Reviews", reviewModel);
