const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const verifyJwt = require('../middleware/jwt');

// Route to render the create session form (GET request)
router.get('/create',verifyJwt,  sessionController.renderCreateSession);

router.get('/update/:sessionId', verifyJwt, sessionController.renderUpdateSession);

// Route to update session
router.post('/update/:sessionId',verifyJwt,  sessionController.updateSession);

// Route to render the create session form (GET request)
router.get('/scan', sessionController.renderQrSession); 

// Route to handle the form submission and create a session (POST request)
router.post('/create',verifyJwt,  sessionController.createSession); 

// Route for all sessions page
router.get('/all',verifyJwt, sessionController.renderAllSessionsPage);

// Route to update session details (like payment, discount, price)
router.put('/:sessionId/update', sessionController.updateSession); 

// Route to fetch a session by ID
router.get('/:sessionId', sessionController.getSessionById); 

// Route to fetch all sessions
router.get('/', sessionController.getAllSessions); 



module.exports = router;
