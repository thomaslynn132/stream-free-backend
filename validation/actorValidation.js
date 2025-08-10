import Joi from "joi";
const { object, string } = Joi;
export function createActorValidation(req, res, next) {
  const schema = object({
    fullName: string().min(3).max(50).required(),
    birthDate: string().required(),
    birthPlace: string().default(""),
    country: string().default(""),
    bio: string().default(""),
    gender: string().valid("male", "female").required(),
    profile: string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ status: 400, message: error.details.map((d) => d.message) });

  next();
}

export function editActorValidation(req, res, next) {
  const schema = object({
    fullName: string().min(3).max(50),
    birthDate: string(),
    birthPlace: string(),
    country: string(),
    bio: string(),
    profile: string(),
  });

  const { error } = schema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ status: 400, message: error.details.map((d) => d.message) });

  next();
}
