import { Schema, model } from "mongoose";

const likeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    media: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true },
);

export default model("Like", likeSchema);
