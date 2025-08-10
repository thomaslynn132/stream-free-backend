import { Schema, model } from "mongoose";
import { generate } from "shortid";

const directorSchema = new Schema({
  directorId: {
    type: String,
    default: generate,
  },
  fullName: {
    type: String,
    required: [true, "full name is required"],
  },
  birthDate: {
    type: String, //!Date
    required: [true, "birth date is required"],
  },
  birthPlace: {
    type: String,
    required: [true, "birth place is required"],
  },
  bio: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: [true, "gender is required"],
  },
  country: {
    type: String,
    required: [true, "country is required"],
  },
  profile: {
    type: String,
    required: [true, "Profile is required"],
  },
  awards: [
    {
      name: {
        type: String,
        required: true,
      },
      year: {
        type: Number,
        required: true,
      },
    },
  ],
  death_date: {
    type: Date,
    required: false,
  },
});

export default model("Directors", directorSchema);
