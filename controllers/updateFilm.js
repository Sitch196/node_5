const getFilmsData = require("../utils/getFilmsData");
const saveFilmData = require("../utils/saveFilmData");

const updateFilm = (req, res) => {
  try {
    const films = getFilmsData();
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ error: "Film ID is required for updating." });
    }

    const filmIndex = films.findIndex((film) => film.id === id);

    if (filmIndex === -1) {
      return res.status(404).json({ error: "Film not found." });
    }

    const existingFilm = films[filmIndex];
    const updatedData = req.body;

    if (
      updatedData.position !== undefined &&
      updatedData.position !== existingFilm.position
    ) {
      const targetPosition = updatedData.position;

      films.splice(filmIndex, 1);

      films.forEach((film) => {
        if (film.position >= targetPosition) {
          film.position += 1;
        }
      });

      existingFilm.position = targetPosition;

      films.push(existingFilm);

      films.sort((a, b) => a.position - b.position);
    }

    Object.assign(existingFilm, updatedData);

    saveFilmData(films);

    res.status(200).json(existingFilm);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update the film." });
  }
};

module.exports = updateFilm;
