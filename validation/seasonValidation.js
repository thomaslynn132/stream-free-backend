import Joi from "joi";
const { object, string } = Joi;
export function createSeasonValidation(req, res, next) {
  const schema = object({
    series: string().required(),
    episodes: array().items(string()),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ status: 400, message: error.details.map((d) => d.message) });

  next();
}

export function editSeasonValidation(req, res, next) {
  const schema = object({
    series: string(),
    episodes: array().items(string()),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ status: 400, message: error.details.map((d) => d.message) });

  next();
}
