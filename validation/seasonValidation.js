const joi = require('joi');


exports.createSeasonValidation = (req, res, next) => {
    const schema = joi.object({
        series: joi.string().required(),
        episodes: joi.array().items(joi.string())
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details.map(d => d.message) });

    next();
}

//! must add validation for editSeasonValidation