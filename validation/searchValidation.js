import Joi from "joi";
const { object, string } = Joi;
export function searchValidation(req, res, next) {
  const schema = object({
    query: string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: 400, message: error.details[0].message });
  }

  next();
}
