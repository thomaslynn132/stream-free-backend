import Joi from "joi";
const { object, string, number } = Joi;
export function createEpisodeValidation(req, res, next) {
  if (req.files.pictures) {
    const pictureUrls = req.files.pictures.map((picture) => picture.filename);
    req.body.pictures = pictureUrls;
  } else
    return res
      .status(400)
      .json({ status: 400, message: "Pictures are required" });
  if (req.files.files) {
    const fileUrls = req.files.files.map((file) => file.filename);
    // Get quality from request body or default to '1080p' if not provided
    const qualities = req.body.qualities || fileUrls.map(() => "1080p");
    req.body.files = fileUrls.map((url, index) => ({
      quality: qualities[index] || "1080p",
      url,
    }));
  }

  const schema = object({
    title: string().required(),
    description: string(),
    releaseDate: string(),
    runtime: number().required(),
    episodeNumber: number().required(),
    seasonNumber: number().required(),
    seriesTitle: string().required(),
    series: string().required(),
    pictures: array().items(string().required()).required(),
    qualities: array().items(
      string().valid("360p", "480p", "720p", "1080p", "4K")
    ),
    files: array()
      .items(
        object({
          quality: string()
            .valid("360p", "480p", "720p", "1080p", "4K")
            .required(),
          url: string().required(),
        })
      )
      .required(),
  });

  const { error } = schema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ status: 400, message: error.details[0].message });

  next();
}

export function editEpisodeValidation(req, res, next) {
  // Handle file uploads if present
  if (req.files) {
    if (req.files.pictures) {
      const pictureUrls = req.files.pictures.map((picture) => picture.filename);
      req.body.pictures = pictureUrls;
    }
    if (req.files.files) {
      const fileUrls = req.files.files.map((file) => file.filename);
      // Get quality from request body or default to '1080p' if not provided
      const qualities = req.body.qualities || fileUrls.map(() => "1080p");
      req.body.files = fileUrls.map((url, index) => ({
        quality: qualities[index] || "1080p",
        url,
      }));
    }
  }

  const schema = object({
    title: string(),
    description: string(),
    releaseDate: string(),
    runtime: number(),
    episodeNumber: number(),
    seasonNumber: number(),
    seriesTitle: string(),
    series: string(),
    pictures: array().items(string()),
    qualities: array().items(
      string().valid("360p", "480p", "720p", "1080p", "4K")
    ),
    files: array().items(
      object({
        quality: string()
          .valid("360p", "480p", "720p", "1080p", "4K")
          .required(),
        url: string().required(),
      })
    ),
  });

  const { error } = schema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ status: 400, message: error.details[0].message });

  next();
}
