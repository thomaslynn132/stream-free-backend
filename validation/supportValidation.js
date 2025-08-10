import Joi from "joi";
const { object, string } = Joi;
export function createSupportTicketValidation(req, res, next) {
  const schema = object({
    fullName: string().required(),
    email: string().email().required(),
    subject: string().required(),
    message: string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
}

export function updateSupportTicketValidation(req, res, next) {
  const schema = object({
    fullName: string().required(),
    email: string().email(),
    status: string().valid("pending", "in progress", "resolved"),
    subject: string().required(),
    message: string(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
}
