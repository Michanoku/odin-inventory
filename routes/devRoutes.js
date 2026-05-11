const express = require("express");
const router = express.Router();
const devController = require("../controllers/devController");

router.get("/", devController.getAllDevs);
router.get("/add", devController.getNewDev);
router.post("/add", devController.postNewDev);
router.get("/edit/:id", devController.getEditDev);
router.post("/edit/:id", devController.postEditDev);
router.post("/delete/:id", devController.postDeleteDev);

module.exports = router;