import Joi from "joi";
const { object, string, boolean, optional, required, number } = Joi;
export function registerValidation(req, res, next) {
  const schema = object({
    fullName: string().min(3).max(50).required(),
    email: string().email().trim().lowercase().required(),
    password: string().min(8).max(50).required(),
    remember: boolean(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ status: 400, message: error.details.map((d) => d.message) });

  next();
}

export function loginValidation(req, res, next) {
  const schema = object({
    email: string().email().trim().lowercase().required(),
    password: string().min(8).max(50).required(),
    remember: boolean(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ status: 400, message: error.details.map((d) => d.message) });

  next();
}

//! must add edit user validation here

//? Subscription Validation
export function addSubscriptionValidation(req, res, next) {
  const schema = object({
    freeTrial: boolean(),
    plan: string().valid("basic", "standard", "premium").when("freeTrial", {
      is: true,
      then: optional(),
      otherwise: required(),
    }),
    time: number().when("freeTrial", {
      is: true,
      then: optional(),
      otherwise: required(),
    }),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ status: 400, message: error.details.map((d) => d.message) });

  next();
}
