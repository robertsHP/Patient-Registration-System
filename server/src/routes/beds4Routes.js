const express = require('express');

const router = express.Router();

const beds4Controller = require('../controllers/beds4Controller');

router.get('/beds4', beds4Controller.getAllBeds4);
router.get('/beds4/month/:month', beds4Controller.getBeds4ByMonth);
router.post('/beds4', beds4Controller.createBed4);
router.put('/beds4/:id_beds4', beds4Controller.updateBed4);
router.delete('/beds4/:id_beds4', beds4Controller.deleteBed4);

module.exports = router;