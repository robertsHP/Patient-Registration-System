const express = require('express');

const router = express.Router();

const bedsController = require('../controllers/bedsController');

router.get('/beds', bedsController.getAllBeds);
router.get('/beds/month/:month', bedsController.getBedsByMonth);
router.post('/beds', bedsController.createBed);
router.put('/beds/:id_beds', bedsController.updateBed);
router.delete('/beds/:id_beds', bedsController.deleteBed);

module.exports = router;