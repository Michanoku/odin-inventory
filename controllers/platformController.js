const { ResultWithContextImpl } = require("express-validator/lib/chain");
const { body, validationResult, matchedData } = require("express-validator");
const db = require("../db/platformQueries");

const validatePlatform = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Platform is required.")
    .bail()
    .matches(/^[\p{L}\d '&/-]+$/u)
    .withMessage("Platform contains invalid characters.")
    .isLength({ max: 32 })
    .withMessage("Platform must not be longer than 32 characters."),
];

const getAllPlatforms = async (req, res) => {
  const platforms = await db.getAllPlatforms();
  res.render("platforms/platformIndex", { title: "Platforms", platforms: platforms });
};

const getNewPlatform = async (req, res) => {
  res.render("platforms/platformAddForm", { title: "Add Platform" });
};

const postNewPlatform = [
  validatePlatform,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const platforms = await db.getAllPlatforms();
      return res.status(400).render("/", {
        title: "Platforms",
        platforms: platforms,
        errors: errors.array(),
      });
    }
    const { name } = matchedData(req);
    await db.createPlatform(name);
    res.redirect("/platforms");
  },
];

const getEditPlatform = async (req, res) => {
  const platform = await db.readPlatform(req.params.id);
  res.render("platforms/platformEditForm", { title: "Edit Platform", platform: platform });
};

const postEditPlatform = [
  validatePlatform,
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
    const { name } = matchedData(req);
    await db.updatePlatform({ id: req.params.id, name });
    res.redirect("/platforms");
  },
];

const postDeletePlatform = async (req, res) => {
  const platform = await db.deletePlatform(req.params.id);
  res.redirect("/platforms");
};

module.exports = {
  getAllPlatforms,
  getNewPlatform,
  postNewPlatform,
  getEditPlatform,
  postEditPlatform,
  postDeletePlatform,
};
