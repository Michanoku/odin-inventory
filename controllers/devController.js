const { ResultWithContextImpl } = require("express-validator/lib/chain");
const { body, validationResult, matchedData } = require("express-validator");
const db = require("../db/devQueries");

const validateDev = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Developer is required.")
    .bail()
    .matches(/^[\p{L}\d '&/-]+$/u)
    .withMessage("Developer contains invalid characters.")
    .isLength({ max: 64 })
    .withMessage(`Developer must not be longer than 64 characters.`),
];

const getAllDevs = async (req, res) => {
  const devs = await db.getAllDevs();
  res.render("devs/devIndex", { title: "Developers", devs: devs });
};

const getNewDev = async (req, res) => {
  res.render("devs/devAddForm", { title: "Add Developer" });
};

const postNewDev = [
  validateDev,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const devs = await db.getAllDevs();
      return res.status(400).render("/devs/devAddForm", {
        title: "Developers",
        devs: devs,
        errors: errors.array(),
      });
    }
    const { name } = matchedData(req);
    await db.createDev(name);
    res.redirect("/developers");
  },
];

const getEditDev = async (req, res) => {
  const dev = await db.readDev(req.params.id);
  res.render("devs/devEditForm", { title: "Edit Developer", dev: dev });
};

const postEditDev = [
  validateDev,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const dev = await db.readDev(req.params.id);
      return res.status(400).render("devs/devEditForm", {
        title: "Edit Developer",
        dev: dev,
        errors: errors.array(),
      });
    }
    const { name } = matchedData(req);
    await db.updateDev({ id: req.params.id, name });
    res.redirect("/developers");
  },
];

const postDeleteDev = async (req, res) => {
  const dev = await db.deleteDev(req.params.id);
  res.redirect("/developers");
};

module.exports = {
  getAllDevs,
  getNewDev,
  postNewDev,
  getEditDev,
  postEditDev,
  postDeleteDev,
};
