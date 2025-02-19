import { Router } from "express";
import { readJSON } from "../utils/readJson.js";
const movies = readJSON("../movies.json");
import { MovieController } from "../controllers/movies.js";

export const moviesRouter = Router();

moviesRouter.get("/", MovieController.getAll);
moviesRouter.get("/:id", MovieController.getById);
moviesRouter.post("/", MovieController.create);
moviesRouter.patch("/:id", MovieController.update);
moviesRouter.delete("/:id", MovieController.delete);
