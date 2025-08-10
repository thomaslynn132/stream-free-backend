import { Schema, model } from "mongoose";
import { generate } from "shortid";

const actorModel = Schema({
  actorId: {
    type: String,
    default: generate,
    // required: [true, 'Actor ID is required'],
  },
  fullName: {
    type: String,
    required: [true, "Full Name is required"],
  },
  birthDate: {
    type: String,
    required: [true, "Date of Birth is required"],
  },
  birthPlace: {
    type: String,
    default: "",
    // required: [true, 'Place of Birth is required'],
  },
  bio: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: [true, "Gender is required"],
  },
  country: {
    type: String,
    default: "",
    // required: [true, 'Country is required']
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

export default model("Actors", actorModel);
