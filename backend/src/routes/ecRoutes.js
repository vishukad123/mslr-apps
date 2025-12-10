const express = require('express');
const ecController = require('../controllers/ecController');
const { verifyToken, isEC } = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken, isEC);

router.get('/referendums', ecController.getAllReferendums);
router.post('/create', ecController.createReferendum);
router.put('/edit/:id', ecController.editReferendum);
router.put('/status/:id', ecController.setStatus);

module.exports = router;