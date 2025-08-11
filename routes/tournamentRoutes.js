const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');

router.get('/',  verifyJwt, tournamentController.renderAllTournaments); // GET all tournaments
router.get('/:id',  verifyJwt, tournamentController.renderTournamentDetail); // GET single tournament
router.post('/:tournamentId/edit/:userKey', tournamentController.updateRegisteredUser);
router.post('/:tournamentId/delete/:userKey', tournamentController.deleteRegisteredUser); // POST to delete user


module.exports = router;
