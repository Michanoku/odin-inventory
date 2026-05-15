require("dotenv").config();
const { ResultWithContextImpl } = require("express-validator/lib/chain");
const { body, validationResult, matchedData } = require("express-validator");
const db = require("../db/genreQueries");

const validateAdd = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Genre is required.")
    .bail()
    .matches(/^[\p{L}\d '&/-]+$/u)
    .withMessage("Genre contains invalid characters.")
    .isLength({ max: 32 })
    .withMessage("Genre must not be longer than 32 characters."),
];

const validateEdit = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Genre is required.")
    .bail()
    .matches(/^[\p{L}\d '&/-]+$/u)
    .withMessage("Genre contains invalid characters.")
    .isLength({ max: 32 })
    .withMessage("Genre must not be longer than 32 characters."),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .bail()
    .custom((value) => {
      if (value !== process.env.DB_DELETE) {
        throw new Error("Invalid password");
      }

      return true;
    }),
];

const validateDelete = [
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .bail()
    .custom((value) => {
      if (value !== process.env.DB_DELETE) {
        throw new Error("Invalid password");
      }

      return true;
    }),
];

const getAllGenres = async (req, res) => {
  const genres = await db.getAllGenres();
  res.render("genres/genreIndex", { title: "Genres", genres: genres });
};

const getNewGenre = async (req, res) => {
  res.render("genres/genreAddForm", { title: "Add Genre" });
};

const postNewGenre = [
  validateAdd,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const genres = await db.getAllGenres();
      return res.status(400).render("genres/genreAddForm", {
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
  validateEdit,
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

const postDeleteGenre = [
  validateDelete,
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
    await db.deleteGenre(req.params.id);
    res.redirect("/genres");
  },
];

module.exports = {
  getAllGenres,
  getNewGenre,
  postNewGenre,
  getEditGenre,
  postEditGenre,
  postDeleteGenre,
};
