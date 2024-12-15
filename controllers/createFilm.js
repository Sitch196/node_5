const getFilmsData = require("../utils/getFilmsData");
const saveFilmsData = require("../utils/saveFilmData");

const createFilm = (req, res) => {
  try {
    const films = getFilmsData();
    const { title, rating, year, budget, gross, poster, position } = req.body;

    const maxPosition =
      films.length > 0 ? Math.max(...films.map((film) => film.position)) : 0;

    const adjustedPosition = Math.min(Math.max(1, position), maxPosition + 1);

    const filmsToUpdate = films
      .filter((film) => film.position >= adjustedPosition)
      .sort((a, b) => b.position - a.position);

    filmsToUpdate.forEach((film) => {
      film.position += 1;
    });

    const newId = String(
      films.length > 0 ? Math.max(...films.map((film) => +film.id)) + 1 : 1
    );

    const newFilm = {
      id: newId,
      title,
      rating,
      year,
      budget,
      gross,
      poster,
      position: adjustedPosition,
    };

    films.push(newFilm);

    films.sort((a, b) => a.position - b.position);

    saveFilmsData(films);

    res.status(201).json(newFilm);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create the film" });
  }
};

module.exports = createFilm;
