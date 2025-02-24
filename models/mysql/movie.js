import mysql, { createConnection } from "mysql2/promise";
import { v4 as uuidv4 } from "uuid";

const config = {
  host: "localhost",
  user: "ignacio",
  port: 8889,
  password: "",
  database: "moviesdb",
};

const connection = await mysql.createConnection(config);

export class MovieModel {
  static async getAll({ genre }) {
    const [movies] = await connection.query("SELECT * FROM movie;");
    return movies;
  }

  static async getById({ id }) {
    const [movies] = await connection.query(
      "SELECT * FROM movie WHERE id = ?;",
      [id]
    );
    if (movies.length === 0) return null;
    return movies;
  }

  static async create({ input }) {
    //FIXME:
    //TODO: ADD THE GENRES TO THE TABLE movie_genres
    //FIXME:

    const {
      genre: genreInput, // genre is an array
      title,
      year,
      duration,
      director,
      rate,
      poster,
    } = input;

    const movieId = uuidv4();

    await connection.query(
      `INSERT INTO movie (id, title, year, director, duration, poster, rate) 
      VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [movieId, title, year, director, duration, poster, rate]
    );

    const [[newMovie]] = await connection.query(
      `SELECT * FROM movie WHERE id = ?;`,
      [movieId]
    );

    const [genres] = await connection.query(
      "SELECT id FROM genre WHERE name IN (?);",
      [genreInput]
    );

    if (genres.length > 0) {
      const genreValues = genres.map((g) => [movieId, g.id]);
      await connection.query(
        "INSERT INTO movie_genres (movie_id, genre_id) VALUES ?;",
        [genreValues]
      );
    }

    return newMovie; // Return the newly created movie
  }

  static async delete({ id }) {
    const [[movie]] = await connection.query(
      "SELECT * FROM movie WHERE id = ?;",
      [id]
    );
    if (!movie) throw new Error("Movie not found");
    await connection.query("DELETE movie FROM movie WHERE id = ?;", [id]);
    console.log("Deleted movie", movie);
    return movie;
  }

  static async update({ id, input }) {
    const { title, year, duration, director, rate, poster } = input;

    const [[movie]] = await connection.query(
      "SELECT * FROM movie WHERE id = ?;",
      [id]
    );

    if (!movie) {
      throw new Error("Movie not found");
    }

    const updateFields = [];
    const updateValues = [];

    if (title !== undefined) {
      updateFields.push("title = ?");
      updateValues.push(title);
    }

    if (year !== undefined) {
      updateFields.push("year = ?");
      updateValues.push(year);
    }

    if (duration !== undefined) {
      updateFields.push("duration = ?");
      updateValues.push(duration);
    }

    if (director !== undefined) {
      updateFields.push("director = ?");
      updateValues.push(director);
    }

    if (rate !== undefined) {
      updateFields.push("rate = ?");
      updateValues.push(rate);
    }

    if (poster !== undefined) {
      updateFields.push("poster = ?");
      updateValues.push(poster);
    }

    if (updateFields.length === 0) {
      throw new Error("No fields to update");
    }
    //.join() >>> transform the array to string
    const sql = `UPDATE movie SET ${updateFields.join(", ")} WHERE id = ?`;
    updateValues.push(id); // Añadir el ID al final de los valores para WHERE
    await connection.query(sql, updateValues);

    const [[updatedMovie]] = await connection.query(
      "SELECT * FROM movie WHERE id = ?;",
      [id]
    );

    return updatedMovie;
  }
}
