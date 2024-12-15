const fs = require("fs");
const getFilmsData = require("../utils/getFilmsData");

const readFilmById = (req, res) => {
  try {
    const films = getFilmsData();
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Film ID is required" });
    }

    const film = films.find((film) => film.id === id);

    if (!film) {
      return res.status(404).json({ error: "Film with this id not found" });
    }

    res.json(film);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read films data" });
  }
};

module.exports = readFilmById;
