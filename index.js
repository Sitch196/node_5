require("dotenv").config();
const express = require("express");
const readAllFilms = require("./controllers/readAllFilms");
const readFilmById = require("./controllers/readFilmById");
const createFilm = require("./controllers/createFilm");
const updateFilm = require("./controllers/updateFilm");
const deletedFilm = require("./controllers/deleteFilm");
const validateFilmData = require("./middleware/validateFilmData");
const { authMiddleware } = require("./middleware/authMiddleware");
const {
  registerManager,
  loginManager,
} = require("./controllers/authController");

const app = express();
app.use(express.json());

app.use(authMiddleware);

app.get("/api/films/readall", readAllFilms);
app.get("/api/films/read", readFilmById);
app.post("/api/films/create", validateFilmData, createFilm);
app.post("/api/films/update", updateFilm);
app.delete("/api/films/delete", deletedFilm);
app.post("/api/auth/register", registerManager);
app.post("/api/auth/login", loginManager);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
