const express = require('express');
const router = express.Router();
const editSessionController = require('../controllers/editSessionController');
const verifyJwt = require('../middleware/jwt');


router.post('/edit-sessions', editSessionController.createEditSession);
router.get('/edit-sessions', editSessionController.getEditSessions);
// Route for all sessions page
router.get('/logs', verifyJwt, editSessionController.renderEditLogsPage);


module.exports = router;
