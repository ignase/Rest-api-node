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

  static async create({ input }) {}

  static async delete({ id }) {}

  static async update({ id, input }) {}
}
