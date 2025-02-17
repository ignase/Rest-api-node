const z = require("zod");

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: "Movie title must be a string",
    required_error: "Title is required",
  }),
  year: z.number().int().min(1900),
  director: z.string(),
  duration: z.number().int().positive(),
  genre: z.array(
    z.enum([
      "Action",
      "Adventure",
      "Comedy",
      "Drama",
      "Fantasy",
      "Horror",
      "Thriller",
      "Sci-Fi",
      "Animation",
    ])
  ),
  rate: z.number().min(0).max(10),
  poster: z.string().url({
    message: "Poster must be a valid URL",
  }),
});

function validateMovie(object) {
  return movieSchema.safeParse(object);
}

function validatePartialMovie(object) {
  return movieSchema.partial().safeParse(object);
}

module.exports = {
  validateMovie,
  validatePartialMovie,
};
