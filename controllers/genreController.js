const { ResultWithContextImpl } = require("express-validator/lib/chain");
const { body, validationResult, matchedData } = require("express-validator");
const db = require("../db/genreQueries");

const validateGenre = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Genre is required.")
    .bail()
    .matches(/^[\p{L}\d '&/-]+$/u)
    .withMessage("Genre contains invalid characters.")
    .isLength({ max: 32 })
    .withMessage(`Genre must not be longer than 32 characters.`),
];

const getAllGenres = async (req, res) => {
  const genres = await db.getAllGenres();
  res.render("genres/genreIndex", { title: "Genres", genres: genres });
};

const getNewGenre = async (req, res) => {
  res.render("genres/genreAddForm", { title: "Add Genre" });
};

const postNewGenre = [
  validateGenre,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const genres = await db.getAllGenres();
      return res.status(400).render("genres/genreIndex", {
        title: "Genres",
        genres: genres,
        errors: errors.array(),
      });
    }
    const { name } = matchedData(req);
    await db.createGenre(name);
    res.redirect("/genres");
  },
];

const getEditGenre = async (req, res) => {
  const genre = await db.readGenre(req.params.id);
  res.render("genres/genreEditForm", { title: "Edit Genre", genre: genre });
};

const postEditGenre = [
  validateGenre,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const genre = await db.readGenre(req.params.id);
      return res.status(400).render("genres/genreEditForm", {
        title: "Edit Genre",
        genre: genre,
        errors: errors.array(),
      });
    }
    const { name } = matchedData(req);
    await db.updateGenre({ id: req.params.id, name });
    res.redirect("/genres");
  },
];

const postDeleteGenre = async (req, res) => {
  const genre = await db.deleteGenre(req.params.id);
  res.redirect("/genres");
};

module.exports = {
  getAllGenres,
  getNewGenre,
  postNewGenre,
  getEditGenre,
  postEditGenre,
  postDeleteGenre,
};
