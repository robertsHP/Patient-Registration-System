// 3rd Party Modules 
const { Router } = require('express'); 
  
// Local Modules 
const controller = require('../controllers/defaultTableController.js'); 

// Initialization 
const router = Router(); 

// Requests  
router.get('/:tableName', controller.selectFromTable);
router.get('/:tableName/:id', controller.selectWithIDFromTable);
router.post('/:tableName', controller.insertIntoTable);
router.put('/:tableName/:id', controller.updateInTable);
router.delete('/:tableName/:id', controller.deleteFromTable);

module.exports = router;