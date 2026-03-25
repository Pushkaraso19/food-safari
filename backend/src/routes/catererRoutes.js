const express = require('express');
const router = express.Router();
const catererController = require('../controllers/catererController');

router.get('/', catererController.getAll);
router.get('/:id', catererController.getById);
router.post('/', catererController.create);

module.exports = router;
