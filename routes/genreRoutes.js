const express = require("express");
const router = express.Router();
const genreController = require('../controllers/genreController');

router.get('/', genreController.getAllGenres);
router.get('/add', genreController.getNewGenre)
router.post('/add', genreController.postNewGenre);
router.get('/edit/:id', genreController.getEditGenre);
router.post('/edit/:id', genreController.postEditGenre);
router.post('/delete/:id', genreController.postDeleteGenre);

module.exports = router;