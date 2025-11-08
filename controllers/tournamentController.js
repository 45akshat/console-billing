// === CONTROLLER: controllers/tournamentController.js ===
const Tournament = require('../models/tournament');

// Ping endpoint for connection check
exports.ping = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Backend connection successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Backend connection failed',
      error: error.message
    });
  }
};

// Render match form
exports.renderMatchForm = async (req, res) => {
  try {
    // Pass user data to the template for authentication context
    res.render('1v1_tournament/matchForm', { user: req.user });
  } catch (error) {
    console.error('Error rendering match form:', error);
    res.status(500).send('Error loading match form');
  }
};

// Render admin dashboard
exports.renderAdmin = async (req, res) => {
  try {
    // Pass user data to the template for authentication context
    res.render('1v1_tournament/admin', { user: req.user });
  } catch (error) {
    console.error('Error rendering admin dashboard:', error);
    res.status(500).send('Error loading admin dashboard');
  }
};

// Process match results
exports.processMatch = async (req, res) => {
  try {
    const matchData = req.body;
    // Add your match processing logic here
    // This is a basic response for now
    res.json({
      status: 'success',
      message: 'Match processed successfully',
      data: matchData
    });
  } catch (error) {
    console.error('Error processing match:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error processing match'
    });
  }
};

// Render all tournaments
exports.renderAllTournaments = async (req, res) => {
  try {
          // Get locationId from the decoded JWT user data
  let locationId = req.user.Location_Id;
  
  if (locationId != "admin") {
    return res.status(400).json({ message: 'admin only' });
  }


  if (!locationId) {
    return res.status(400).json({ message: 'Location ID is required' });
  }

    const tournaments = await Tournament.find();
    res.render('tournament/index', { tournaments });
  } catch (err) {
    res.status(500).send('Error loading tournaments');
  }
};

// Render single tournament detail view
exports.renderTournamentDetail = async (req, res) => {
  try {
          // Get locationId from the decoded JWT user data
  let locationId = req.user.Location_Id;


  if (!locationId) {
    return res.status(400).json({ message: 'Location ID is required' });
  }

  
  if (locationId != "admin") {
    return res.status(400).json({ message: 'admin only' });
  }

  
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).send('Tournament not found');

    // Convert Map to Object (optional)
    const registered = Object.fromEntries(tournament.registered);
    
    res.render('tournament/details', {
      tournament,
      registered,
      availableLocations: tournament.available_locations,
    });
  } catch (err) {
    res.status(500).send('Error loading tournament detail');
  }
};

// Update a registered player's data
exports.updateRegisteredUser = async (req, res) => {
  try {
    const { tournamentId, userKey } = req.params;
    const { team_name, selectedLocation } = req.body;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) return res.status(404).send('Tournament not found');

    const users = tournament.registered.get(userKey);
    if (!users || users.length === 0) return res.status(404).send('User not found');

    const user = users[0];
    const oldLocation = user.selectedLocation;

    // Normalize values
    const newTeamName = team_name && team_name.trim() !== '' ? team_name : null;
    const newLocation = selectedLocation && selectedLocation.trim() !== '' ? selectedLocation : null;

    // Update location availability count
    if (oldLocation && oldLocation !== newLocation) {
      // Increase count for old location
      if (tournament.available_locations.has(oldLocation)) {
        tournament.available_locations.set(
          oldLocation,
          tournament.available_locations.get(oldLocation) + 1
        );
      }
    }

    if (newLocation && oldLocation !== newLocation) {
      // Decrease count for new location
      if (tournament.available_locations.has(newLocation)) {
        tournament.available_locations.set(
          newLocation,
          Math.max(0, tournament.available_locations.get(newLocation) - 1)
        );
      }
    }

    // Apply updates to user object
    user.team_name = newTeamName;
    user.selectedLocation = newLocation;

    // Set and mark modified
    tournament.registered.set(userKey, users);
    tournament.markModified(`registered.${userKey}`);
    tournament.markModified('available_locations');

    await tournament.save();

    res.redirect(`/tournament/${tournamentId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating user');
  }
};


// Delete a registered player
exports.deleteRegisteredUser = async (req, res) => {
  try {
    const { tournamentId, userKey } = req.params;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) return res.status(404).send('Tournament not found');

    const users = tournament.registered.get(userKey);
    if (!users || users.length === 0) return res.status(404).send('User not found');

    // Update location availability count (if a location was selected)
    const selectedLocation = users[0].selectedLocation;
    if (selectedLocation && tournament.available_locations.has(selectedLocation)) {
      tournament.available_locations.set(
        selectedLocation,
        tournament.available_locations.get(selectedLocation) + 1
      );
    }

    // Delete the user
    tournament.registered.delete(userKey);

    tournament.markModified('registered');
    tournament.markModified('available_locations');
    await tournament.save();

    res.redirect(`/tournament/${tournamentId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting user');
  }
};
