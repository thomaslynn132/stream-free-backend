import Joi from "joi";
const { object, string, number } = Joi;
export function createReviewValidation(req, res, next) {
  const schema = object({
    fullName: string().required(),
    email: string().required(),
    text: string().required(),
    rating: number().required(),
    media: string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  next();
}

//! add more validation functions here
