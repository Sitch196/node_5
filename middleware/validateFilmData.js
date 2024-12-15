const validateFilmData = (req, res, next) => {
  const { title, rating, year, budget, gross, poster, position } = req.body;

  if (
    !title ||
    !rating ||
    !year ||
    budget == null ||
    gross == null ||
    !poster ||
    position == null
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (year < 1888) {
    return res.status(400).json({ error: "Year must be 1888 or later." });
  }

  if (budget < 0 || gross < 0) {
    return res
      .status(400)
      .json({ error: "Budget and gross must be non-negative numbers." });
  }

  if (!/^\d+(\.\d+)?$/.test(rating)) {
    return res
      .status(400)
      .json({ error: "Rating must be a valid number (e.g., '8.5')." });
  }

  if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/.test(poster)) {
    return res.status(400).json({ error: "Poster must be a valid image URL." });
  }

  if (position < 1) {
    return res
      .status(400)
      .json({ error: "Position must be a positive integer." });
  }

  next();
};

module.exports = validateFilmData;
