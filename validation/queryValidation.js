import { isValidObjectId } from "mongoose";

export function queryValidation(id, res, text) {
  if (!isValidObjectId(id)) return res.status(400).json({ message: text });
}
