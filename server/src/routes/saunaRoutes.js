const express = require('express');

const router = express.Router();

const saunaController = require('../controllers/saunaController');

router.get('/sauna', saunaController.getAllSaunaSessions);
router.get('/sauna/month/:month', saunaController.getSaunaSessionsByMonth);
router.post('/sauna', saunaController.createSaunaSession);
router.put('/sauna/:id_sauna', saunaController.updateSaunaSession);
router.delete('/sauna/:id_sauna', saunaController.deleteSaunaSession);

module.exports = router;