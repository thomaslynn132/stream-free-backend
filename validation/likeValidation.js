import Joi from "joi";
const { object, string } = Joi;
export function likeValidation(req, res, next) {
  // console.log("likeValidation.js")
  const schema = object({
    userId: string().required(),
    media: string().required(),
  });
  const { error } = schema.validate(req.body);

  if (error)
    return res
      .status(400)
      .json({ status: 400, message: error.details.map((d) => d.message) });

  next();
}

export function unlikeValidation(req, res, next) {
  const schema = object({
    userId: string().required(),
    media: string().required(),
  });
  const { error } = schema.validate(req.body);

  if (error)
    return res
      .status(400)
      .json({ status: 400, message: error.details.map((d) => d.message) });

  next();
}
