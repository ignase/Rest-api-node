import { readJSON } from "../utils/readJson.js";
import { randomUUID } from "node:crypto";
const movies = readJSON("../movies.json");

export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      return movies.filter((movie) =>
        movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
      );
    }
    return movies;
  }

  static async getById({ id }) {
    const movie = movies.find((movie) => movie.id === id);
    if (movie) return movie;
    return "Movie not found";
  }

  static async create({ input }) {
    const newMovie = {
      id: randomUUID(),
      ...input,
    };

    movies.push(newMovie);
    return newMovie;
  }

  static async delete({ id }) {
    const index = movies.findIndex((movie) => movie.id === id);
    if (index === -1) {
      return null;
    }
    movies.splice(index, 1);
    return true;
  }

  static async update({ id, input }) {
    const movieIndex = movies.findIndex((movie) => movie.id === id);
    if (movieIndex === -1) {
      return null;
    }
    const updateMovie = {
      ...movies[movieIndex],
      ...input,
    };

    movies[movieIndex] = updateMovie;
    return updateMovie;
  }
}
