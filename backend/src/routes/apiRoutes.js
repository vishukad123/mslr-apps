const express = require('express');
const apiController = require('../controllers/apiController');

const router = express.Router();

router.get('/referendums', apiController.getReferendumsByStatus);
router.get('/referendum/:id', apiController.getReferendumById);

module.exports = router;