const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");

router.get("/", gameController.getAllGames);
router.get("/add", gameController.getNewGame);
router.post("/add", gameController.postNewGame);
router.get("/edit/:id", gameController.getEditGame);
router.post("/edit/:id", gameController.postEditGame);
router.post("/delete/:id", gameController.postDeleteGame);

module.exports = router;
