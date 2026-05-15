require("dotenv").config();
const { ResultWithContextImpl } = require("express-validator/lib/chain");
const { body, validationResult, matchedData } = require("express-validator");
const db = require("../db/platformQueries");

const validateAdd = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Platform is required.")
    .bail()
    .matches(/^[\p{L}\d '&/-]+$/u)
    .withMessage("Platform contains invalid characters.")
    .isLength({ max: 64 })
    .withMessage("Platform must not be longer than 32 characters."),
  body("abbrev")
    .trim()
    .notEmpty()
    .withMessage("Abbreviation is required.")
    .bail()
    .matches(/^[\p{L}\d '&/-]+$/u)
    .withMessage("Abbreviation contains invalid characters.")
    .isLength({ max: 8 })
    .withMessage("Abbreviation must not be longer than 8 characters."),
];

const validateEdit = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Platform is required.")
    .bail()
    .matches(/^[\p{L}\d '&/-]+$/u)
    .withMessage("Platform contains invalid characters.")
    .isLength({ max: 64 })
    .withMessage("Platform must not be longer than 32 characters."),
  body("abbrev")
    .trim()
    .notEmpty()
    .withMessage("Abbreviation is required.")
    .bail()
    .matches(/^[\p{L}\d '&/-]+$/u)
    .withMessage("Abbreviation contains invalid characters.")
    .isLength({ max: 8 })
    .withMessage("Abbreviation must not be longer than 8 characters."),
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

const getAllPlatforms = async (req, res) => {
  const platforms = await db.getAllPlatforms();
  res.render("platforms/platformIndex", {
    title: "Platforms",
    platforms: platforms,
  });
};

const getNewPlatform = async (req, res) => {
  res.render("platforms/platformAddForm", { title: "Add Platform" });
};

const postNewPlatform = [
  validateAdd,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const platforms = await db.getAllPlatforms();
      return res.status(400).render("/platforms/platformAddForm", {
        title: "Platforms",
        platforms: platforms,
        errors: errors.array(),
      });
    }
    const { name, abbrev } = matchedData(req);
    await db.createPlatform({ name, abbrev });
    res.redirect("/platforms");
  },
];

const getEditPlatform = async (req, res) => {
  const platform = await db.readPlatform(req.params.id);
  res.render("platforms/platformEditForm", {
    title: "Edit Platform",
    platform: platform,
  });
};

const postEditPlatform = [
  validateEdit,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const platform = await db.readPlatform(req.params.id);
      return res.status(400).render("platforms/platformEditForm", {
        title: "Edit Platform",
        platform: platform,
        errors: errors.array(),
      });
    }
    const { name, abbrev } = matchedData(req);
    await db.updatePlatform({ id: req.params.id, name, abbrev });
    res.redirect("/platforms");
  },
];

const postDeletePlatform = [
  validateDelete,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const platform = await db.readPlatform(req.params.id);
      return res.status(400).render("platforms/platformEditForm", {
        title: "Edit Platform",
        platform: platform,
        errors: errors.array(),
      });
    }
    await db.deletePlatform(req.params.id);
    res.redirect("/platforms");
  },
];

module.exports = {
  getAllPlatforms,
  getNewPlatform,
  postNewPlatform,
  getEditPlatform,
  postEditPlatform,
  postDeletePlatform,
};
