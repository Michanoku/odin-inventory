const express = require("express");
const router = express.Router();
const platformController = require("../controllers/platformController");

router.get("/", platformController.getAllPlatforms);
router.get("/add", platformController.getNewPlatform);
router.post("/add", platformController.postNewPlatform);
router.get("/edit/:id", platformController.getEditPlatform);
router.post("/edit/:id", platformController.postEditPlatform);
router.post("/delete/:id", platformController.postDeletePlatform);

module.exports = router;
