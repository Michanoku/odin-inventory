const router = express.Router();
const devController = require('../controllers/devController');

router.get('/', devController.getAllDevs);

module.exports = router;