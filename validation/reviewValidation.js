const joi = require('joi');


exports.createReviewValidation = (req, res, next) => {
    const schema = joi.object({
        fullName: joi.string().required(),
        email: joi.string().required(),
        text: joi.string().required(),
        rating: joi.number().required(),
        media: joi.string().required()
    })
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    next();
};


//! add more validation functions here