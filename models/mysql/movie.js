import mysql, { createConnection } from "mysql2/promise";

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

    const result = await connection.query(
      `INSERT INTO movie (id, title, year, director, duration, poster, rate) 
       VALUES (UUID(), ?, ?, ?, ?, ?, ?);`,
      [title, year, director, duration, poster, rate]
    );

    const [[newMovie]] = await connection.query(
      `SELECT * FROM movie WHERE id = LAST_INSERT_ID();`
    );

    return newMovie; // Return the newly created movie
  }

  static async delete({ id }) {
    console.log(">>>>>>>>>>> ID: ", id);
    const [[movie]] = await connection.query(
      "SELECT * FROM movie WHERE id = ?;",
      [id]
    );
    if (!movie) throw new Error("Movie not found");
    await connection.query("DELETE movie FROM movie WHERE id = ?;", [id]);
    console.log("Deleted movie", movie);
    return movie;
  }

  static async update({ id, input }) {}
}
