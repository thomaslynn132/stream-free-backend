import Joi from "joi";
const { object, string, number } = Joi;
export function createSeriesValidation(req, res, next) {
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

  req.body.thumbnail = thumbnailUrl;
  req.body.trailer = trailerUrl;
  req.body.cover = coverUrl;

  const schema = object({
    title: string().required(),
    description: string(),
    director: string().required(),
    release_date: string().required(),
    genres: array().items(string()).required(),
    category: array().items(string()).required(),
    country: string().required(),
    language: string().required(),
    ageRating: string(),
    production_company: string(),
    rotten_rating: number().required(),
    imdb_rating: number().required(),
    age_rating: string(),
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
  });

  const { error } = schema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ status: 400, message: error.details.map((d) => d.message) });

  next();
}

export function editSeriesValidation(req, res, next) {
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
  }

  const schema = object({
    title: string(),
    description: string(),
    director: string(),
    release_date: string(),
    genres: array().items(string()),
    category: array().items(string()),
    country: string(),
    language: string(),
    ageRating: string(),
    production_company: string(),
    rotten_rating: number(),
    imdb_rating: number(),
    age_rating: string(),
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
  });

  const { error } = schema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ status: 400, message: error.details.map((d) => d.message) });

  next();
}
