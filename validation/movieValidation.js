import Joi from "joi";
const { object, string, number } = Joi;
export function createMovieValidation(req, res, next) {
  if (!req.files.thumbnail)
    return res
      .status(400)
      .json({ status: 400, message: "Thumbnail is required" });
  const thumbnailUrl = req.files.thumbnail[0].filename;

  if (!req.files.trailer)
    return res
      .status(400)
      .json({ status: 400, message: "Trailer is required" });
  const trailerUrl = req.files.trailer[0].filename;

  if (!req.files.cover)
    return res.status(400).json({ status: 400, message: "Cover is required" });
  const coverUrl = req.files.cover[0].filename;

  if (req.files.files) {
    const fileUrls = req.files.files.map((file) => file.filename);
    // Get quality from request body or default to '1080p' if not provided
    const qualities = req.body.qualities || fileUrls.map(() => "1080p");
    req.body.files = fileUrls.map((url, index) => ({
      quality: qualities[index] || "1080p",
      url,
    }));
  }

  req.body.thumbnail = thumbnailUrl;
  req.body.trailer = trailerUrl;
  req.body.cover = coverUrl;

  const schema = object({
    title: string().required(),
    description: string(),
    director: string().required(),
    release_date: string().required(),
    duration: number().required(),
    genres: array().items(string()).required(),
    category: array().items(string()).required(),
    country: string().required(),
    language: string().required(),
    age_rating: string(),
    production_company: string(),
    rotten_rating: number().required(),
    imdb_rating: number().required(),
    awards: array().items(
      object({
        name: string().required(),
        year: string().required(),
      })
    ),
    boxOffice: object({
      budget: number(),
      gross: number(),
    }),
    top250rank: number().min(1).max(250),
    release_status: string()
      .valid("now showing", "coming soon", "expired")
      .default("now showing"),
    actors: array().items(string()),
    thumbnail: string().required(),
    trailer: string().required(),
    cover: string().required(),
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
      .json({ status: 400, message: error.details.map((d) => d.message) });

  next();
}

export function editMovieValidation(req, res, next) {
  // Handle file uploads if present
  if (req.files) {
    if (req.files.thumbnail) {
      req.body.thumbnail = req.files.thumbnail[0].filename;
    }
    if (req.files.trailer) {
      req.body.trailer = req.files.trailer[0].filename;
    }
    if (req.files.cover) {
      req.body.cover = req.files.cover[0].filename;
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
    director: string(),
    release_date: string(),
    duration: number(),
    genres: array().items(string()),
    category: array().items(string()),
    country: string(),
    language: string(),
    age_rating: string(),
    production_company: string(),
    rotten_rating: number(),
    imdb_rating: number(),
    awards: array().items(
      object({
        name: string().required(),
        year: string().required(),
      })
    ),
    boxOffice: object({
      budget: number(),
      gross: number(),
    }),
    top250rank: number().min(1).max(250),
    release_status: string().valid("now showing", "coming soon", "expired"),
    actors: array().items(string()),
    thumbnail: string(),
    trailer: string(),
    cover: string(),
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
      .json({ status: 400, message: error.details.map((d) => d.message) });

  next();
}
