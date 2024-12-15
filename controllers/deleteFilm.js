const fs = require("fs");
const getFilmsData = require("../utils/getFilmsData");
const saveFilmsData = require("../utils/saveFilmData");

const deleteFilm = (req, res) => {
  try {
    const films = getFilmsData();
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ error: "Film ID is required for deletion." });
    }

    const filmIndex = films.findIndex((film) => film.id === id);

    if (filmIndex === -1) {
      return res.status(404).json({ error: "Film not found." });
    }

    const deletedFilm = films.splice(filmIndex, 1)[0];

    films.forEach((film) => {
      if (film.position > deletedFilm.position) {
        film.position -= 1;
      }
    });

    saveFilmsData(films);

    res.status(200).json({
      message: "Film deleted successfully.",
      deletedFilm,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete the film." });
  }
};

module.exports = deleteFilm;
