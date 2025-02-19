import express, { json } from "express";
import { moviesRouter } from "./routes/movies.js";

const app = express();
app.use(json());

app.use("/movies", moviesRouter);

const PORT = process.env.PORT ?? 4000;

app.listen(PORT, () => {
  console.log(`Port listening on ${PORT}`);
});
