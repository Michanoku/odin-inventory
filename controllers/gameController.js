const { ResultWithContextImpl } = require("express-validator/lib/chain");
const { body, validationResult, matchedData } = require("express-validator");
const gameDb = require("../db/gameQueries");
const devDb = require("../db/devQueries");
const genreDb = require("../db/genreQueries");
const platformDb = require("../db/platformQueries");

const validateGame = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required.")
    .bail()
    .matches(/^[\p{L}\d '&/-]+$/u)
    .withMessage("Title contains invalid characters.")
    .isLength({ max: 255 })
    .withMessage("Title must not be longer than 255 characters."),
  body("genreIds")
    .exists({ values: "falsy" })
    .withMessage("Select at least one genre."),
  body("genreIds.*").isInt(),
  body("platformIds")
    .exists({ values: "falsy" })
    .withMessage("Select at least one platform."),
  body("platformIds.*").isInt(),
  body("developerId").isInt(),
];

const validateEntries = async (developerId, genreIds, platformIds) => {
  const dbErrors = [];
  const devEntry = await devDb.readDev(developerId);
  if (!devEntry) {
    dbErrors.push({ msg: "Developer not found." });
  }
  for (const id of genreIds) {
    const genreEntry = await genreDb.readGenre(id);
    if (!genreEntry) {
      dbErrors.push({ msg: "Genre not found."});
    }
  };
  for (const id of platformIds) {
    const platformEntry = await platformDb.readPlatform(id);
    if (!platformEntry) {
      dbErrors.push({ msg: "Platform not found." });
    }
  };
  return dbErrors;
};

const getAllGames = async (req, res) => {
  const games = await gameDb.getAllGames();
  res.render("games/gameIndex", { title: "Games", games: games });
};

const getNewGame = async (req, res) => {
  const [genres, platforms, developers] = await Promise.all([
    genreDb.getAllGenres(),
    platformDb.getAllPlatforms(),
    devDb.getAllDevs(),
  ]);
  res.render("games/gameAddForm", { title: "Add Game", genres: genres, platforms: platforms, developers: developers });
};

const postNewGame = [
  validateGame,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const [genres, platforms, developers] = await Promise.all([
        genreDb.getAllGenres(),
        platformDb.getAllPlatforms(),
        devDb.getAllDevs(),
      ]);
      return res.status(400).render("games/gameAddForm", {
        title: "Add Game",
        genres: genres, 
        platforms: platforms, 
        developers: developers,
        errors: errors.array(),
      });
    }
    const { title, developerId, genreIds, platformIds } = matchedData(req);
    const dbErrors = await validateEntries(developerId, genreIds, platformIds);
    if (dbErrors.length > 0) {
      const [genres, platforms, developers] = await Promise.all([
        genreDb.getAllGenres(),
        platformDb.getAllPlatforms(),
        devDb.getAllDevs(),
      ]);
      return res.status(400).render("games/gameAddForm", {
        title: "Add Game",
        genres: genres, 
        platforms: platforms, 
        developers: developers,
        errors: dbErrors,
      });
    }
    await gameDb.createGame({ title, developerId, genreIds, platformIds });
    res.redirect("/games");
  },
];

const getEditGame = async (req, res) => {
  const [game, genres, platforms, developers] = await Promise.all([
    gameDb.readGame(req.params.id),
    genreDb.getAllGenres(),
    platformDb.getAllPlatforms(),
    devDb.getAllDevs(),
  ]);
  res.render("games/gameEditForm", { title: "Edit Game", game: game, genres: genres, platforms: platforms, developers: developers });
};

const postEditGame = [
  validateGame,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const [game, genres, platforms, developers] = await Promise.all([
        gameDb.readGame(req.params.id),
        genreDb.getAllGenres(),
        platformDb.getAllPlatforms(),
        devDb.getAllDevs(),
      ]);
      return res.status(400).render("games/gameEditForm", {
        title: "Edit Game",
        game: game,
        genres: genres, 
        platforms: platforms, 
        developers: developers,
        errors: errors.array(),
      });
    }
    const { title, developerId, genreIds, platformIds } = matchedData(req);
    const dbErrors = await validateEntries(developerId, genreIds, platformIds);
    if (dbErrors.length > 0) {
      const [game, genres, platforms, developers] = await Promise.all([
        gameDb.readGame(req.params.id),
        genreDb.getAllGenres(),
        platformDb.getAllPlatforms(),
        devDb.getAllDevs(),
      ]);
      return res.status(400).render("/games/gameEditForm", {
        title: "Edit Game",
        game: game,
        genres: genres, 
        platforms: platforms, 
        developers: developers,
        errors: errors.array(),
      });
    }
    await gameDb.updateGame({ id: req.params.id, title, developerId, genreIds, platformIds });
    res.redirect("/games");
  },
];

const postDeleteGame = async (req, res) => {
  const dev = await gameDb.deleteGame(req.params.id);
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
