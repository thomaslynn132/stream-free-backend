const joi = require('joi');


exports.createEpisodeValidation = (req, res, next) => {
    if (req.files.pictures) {
        const pictureUrls = req.files.pictures.map(picture => picture.filename);
        req.body.pictures = pictureUrls;
    }
    else return res.status(400).json({ status: 400, message: "Pictures are required" });
    if (req.files.files) {
        const fileUrls = req.files.files.map(file => file.filename);
        req.body.files = fileUrls.map((url, index) => ({
            quality: "1080p",
            url
        }));
    }

    const schema = joi.object({
        title: joi.string().required(),
        description: joi.string(),
        releaseDate: joi.string(),
        runtime: joi.number().required(),
        episodeNumber: joi.number().required(),
        seasonNumber: joi.number().required(),
        seriesTitle: joi.string().required(),
        series: joi.string().required(),
        pictures: joi.array().items(joi.string().required()).required(),
        files: joi.array().items(joi.object({
            quality: joi.string().valid('360p', '480p', '720p', '1080p', '4K').required(),
            url: joi.string().required()
        })).required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details[0].message });

    next();
}