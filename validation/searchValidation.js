const Joi = require("joi");

exports.searchValidation = (req, res, next) => {
    const schema = Joi.object({
        query: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ status: 400, message: error.details[0].message });
    }

    next();
};