const express = require('express');
const voterController = require('../controllers/voterController');
const { verifyToken, isVoter } = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken, isVoter);

router.get('/referendums', voterController.getReferendums);
router.post('/vote', voterController.vote);

module.exports = router;