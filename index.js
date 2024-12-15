const express = require("express");
const readAllFilms = require("./controllers/readAllFilms");
const readFilmById = require("./controllers/readFilmById");
const createFilm = require("./controllers/createFilm");
const updateFilm = require("./controllers/updateFilm");
const deletedFilm = require("./controllers/deleteFilm");
const validateFilmData = require("./middleware/validateFilmData");

const app = express();
app.use(express.json());

app.get("/api/films/readall", readAllFilms);
app.get("/api/films/read", readFilmById);
app.post("/api/films/create", validateFilmData, createFilm);
app.post("/api/films/update", updateFilm);
app.delete("/api/films/delete", deletedFilm);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
