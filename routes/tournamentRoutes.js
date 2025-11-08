const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');
const verifyJwt = require('../middleware/jwt');

router.get('/match/ping', tournamentController.ping); // Ping endpoint for connection check
router.get('/match/form', verifyJwt, tournamentController.renderMatchForm); // GET match form page
router.get('/',  verifyJwt, tournamentController.renderAllTournaments); // GET all tournaments
router.get('/admin', verifyJwt, tournamentController.renderAdmin); // GET admin dashboard (must be before /:id)
router.get('/:id',  verifyJwt, tournamentController.renderTournamentDetail); // GET single tournament
router.post('/:tournamentId/edit/:userKey', tournamentController.updateRegisteredUser);
router.post('/:tournamentId/delete/:userKey', tournamentController.deleteRegisteredUser); // POST to delete user
router.post('/match', tournamentController.processMatch); // Process match results


module.exports = router;
