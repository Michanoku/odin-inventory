const { ResultWithContextImpl } = require("express-validator/lib/chain");
const { body, validationResult, matchedData } = require("express-validator");
const db = require("../db/gameQueries");

const validateGame = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required.")
    .bail()
    .matches(/^[\p{L}\d '&/-]+$/u)
    .withMessage("Title contains invalid characters.")
    .isLength({ max: 64 })
    .withMessage("Title must not be longer than 64 characters."),
  body("genreIds")
    .isArray({ min: 1 })
    .withMessage("Select at least one genre."),
  body("genreIds.*").isInt(),
  body("platformIds")
    .isArray({ min: 1 })
    .withMessage("Select at least one platform."),
  body("platformIds.*").isInt(),
  body("developerId").isInt(),
];

const validateEntries = async (developerId, genreIds, platformIds) => {
  const dbErrors = [];
  const devEntry = await db.validateEntry("developer", developerId);
  if (!devEntry) {
    dbErrors.push({ msg: "Developer not found." });
  }
  for (const id of genreIds) {
    const genreEntry = await db.validateEntry("genre", id);
    if (!genreEntry) {
      dbErrors.push({ msg: "Genre not found."});
    }
  };
  for (const id of platformIds) {
    const platformEntry = await db.validateEntry("platform", id);
    if (!platformEntry) {
      dbErrors.push({ msg: "Platform not found." });
    }
  };
  return dbErrors;
};

const getAllGames = async (req, res) => {
  const devs = await db.getAllGames();
  res.render("games/gameIndex", { title: "Games", games: games });
};

const getNewGame = async (req, res) => {
  res.render("games/gameAddForm", { title: "Add Game" });
};

const postNewGame = [
  validateGame,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const games = await db.getAllGames();
      return res.status(400).render("/", {
        title: "Games",
        games: games,
        errors: errors.array(),
      });
    }
    const { title, developerId, genreIds, platformIds } = matchedData(req);
    const dbErrors = await validateEntries(developerId, genreIds, platformIds);
    if (dbErrors.length > 0) {
      const games = await db.getAllGames();
      return res.status(400).render("/", {
        title: "Games",
        games: games,
        errors: dbErrors,
      });
    }
    await db.createGame({ title, developerId, genreIds, platformIds });
    res.redirect("/games");
  },
];

const getEditGame = async (req, res) => {
  const game = await db.readGame(req.params.id);
  res.render("games/gameEditForm", { title: "Edit Game", game: game });
};

const postEditGame = [
  validateGame,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const game = await db.readGame(req.params.id);
      return res.status(400).render("games/gameEditForm", {
        title: "Edit Game",
        game: game,
        errors: errors.array(),
      });
    }
    const { title, developerId, genreIds, platformIds } = matchedData(req);
    const dbErrors = await validateEntries(developerId, genreIds, platformIds);
    if (dbErrors.length > 0) {
      const games = await db.getAllGames();
      return res.status(400).render("/", {
        title: "Games",
        games: games,
        errors: dbErrors,
      });
    }
    await db.updateGame({ id: req.params.id, title, developerId, genreIds, platformIds });
    res.redirect("/games");
  },
];

const postDeleteGame = async (req, res) => {
  const dev = await db.deleteGame(req.params.id);
  res.redirect("/games");
};

module.exports = {
  getAllGames,
  getNewGame,
  postNewGame,
  getEditGame,
  postEditGame,
  postDeleteGame,
};
