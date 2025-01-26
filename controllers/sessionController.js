const { updateCashInHand, deductWalletAmount, addWalletAmount } = require('../services/loginService');
const sessionService = require('../services/sessionService');
const jwt = require('jsonwebtoken');

// Helper function to convert date to IST
const convertToIST = (date) => {
    const istOffset = 330; // IST offset in minutes (UTC+5:30)
    return new Date(date.getTime() + (istOffset * 60 * 1000));
};

// Create a new session
exports.createSession = async (req, res) => {
    try {
        const sessionData = req.body;  // Expect session data in the request body
        const user = req.user;

        // Log or use the user data as needed
        console.log('Decoded JWT User:', user);

        if (user.Location_Id !== 'admin') {
            // Remove '-admin' from user.Location_Id if it contains it
            user.Location_Id = user.Location_Id.includes('-admin') 
                ? user.Location_Id.replace('-admin', '') 
                : user.Location_Id;
        }


        // Add Location_Id to sessionData
        sessionData.Location_Id = user.Location_Id || "default_location"; // Assign user.Location_Id or a default value

        // Convert createdAt to IST
        sessionData.createdAt = convertToIST(new Date());

        // Deduct wallet amount from user's existing wallet balance
        if (sessionData.UserID != null && sessionData.payment.wallet > 0) {
            await deductWalletAmount(sessionData.UserID, sessionData.totalPrice);
        }

        // Log "Oops" if primaryUserID is null
        if (!sessionData.primaryUserID) {
            console.log("Oops");
        }

        // Create session using the service
        const session = await sessionService.createSession(sessionData);

        updateCashInHand(user.Location_Id, sessionData.payment.cash);

        // Send the response with the created session
        res.status(201).json({
            success: true,  // Add success field
            message: 'Session created successfully',
            session,
        });
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({
            message: 'Error creating session',
            error: error.message,
        });
    }
};

exports.updateSession = async (req, res) => {
    try {
        const { sessionId } = req.params; // Extract sessionId from route parameters
        const { sessionData, oldSessionData } = req.body; // Extract new and old session data from request body
        console.log(oldSessionData.UserID)

        // If the session is for a member, handle wallet adjustments
        if (oldSessionData.isMember) {
            // Add the amount of the old session back to the wallet
            await addWalletAmount(oldSessionData.UserID, oldSessionData.totalPrice);
        }

        if (sessionData.isMember) {
            // Deduct the amount of the new session from the wallet
            await deductWalletAmount(oldSessionData.UserID, sessionData.totalPrice);
        }

        // Apply cash discount
        if (sessionData.cash_discount > 0) {
            sessionData.totalPrice -= sessionData.cash_discount;
        }

        if (sessionData.isMember == false) {
            await updateCashInHand(oldSessionData.Location_Id, -oldSessionData.payment.cash);
            await updateCashInHand(oldSessionData.Location_Id, sessionData.payment.cash);
        }


        // Update session details using the service
        const updatedSession = await sessionService.updateSessionDetails(sessionId, sessionData);

        // Send the response with the updated session
        res.status(200).json({
            success: true,  // Add success field
            message: 'Session updated successfully',
            updatedSession,
        });
    } catch (error) {
        console.error('Error updating session:', error);
        res.status(500).json({
            success: false, // Indicate failure
            message: 'Error updating session',
            error: error.message,
        });
    }
};

// Get session details by ID
exports.getSessionById = async (req, res) => {
    try {
        const { sessionId } = req.params;

        // Fetch session details using the service
        const session = await sessionService.getSessionById(sessionId);

        // Convert createdAt to IST
        session.createdAt = convertToIST(new Date(session.createdAt));

        // Send the response with the session data
        res.status(200).json({
            session,
        });
    } catch (error) {
        console.error('Error fetching session:', error);
        res.status(500).json({
            message: 'Error fetching session',
            error: error.message,
        });
    }
};

// Get all sessions
exports.getAllSessions = async (req, res) => {
    try {
        // Fetch all sessions using the service
        const sessions = await sessionService.getAllSessions();

        // Convert createdAt to IST for all sessions


        // Send the response with all sessions
        res.status(200).json({
            sessions,
        });
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({
            message: 'Error fetching sessions',
            error: error.message,
        });
    }
};

// In sessionController.js
exports.renderCreateSession = async (req, res) => {
    try {
        const user = req.user;

        // Log or use the user data as needed
        console.log('Decoded JWT User:', user);

        // Pass locationId to the view
        // If Location_Id is not 'admin', filter by Location_Id
        if (user.Location_Id !== 'admin') {
            // Remove '-admin' from user.Location_Id if it contains it
            user.Location_Id = user.Location_Id.includes('-admin') 
                ? user.Location_Id.replace('-admin', '') 
                : user.Location_Id;
        }

                
        return res.render('sessions/createSessions', { locationId: user.Location_Id });
    } catch (error) {
        console.error('Error fetching sessions: ', error);
    }
};

// In sessionController.js
exports.renderUpdateSession = async (req, res) => {
    const user = req.user;

    const sessionId = req.params.sessionId;
    const session = await sessionService.getSessionById(sessionId); // Fetch session details

    // Convert createdAt to IST
    session.createdAt = convertToIST(new Date(session.createdAt));
    if (user.Location_Id !== 'admin') {
        // Remove '-admin' from user.Location_Id if it contains it
        user.Location_Id = user.Location_Id.includes('-admin') 
            ? user.Location_Id.replace('-admin', '') 
            : user.Location_Id;
    }


    return res.render('sessions/updateSession', { session, locationId: user.Location_Id  });
};

// In sessionController.js
exports.renderQrSession = async (req, res) => {
    try {
        return res.render('sessions/scanQr');
    } catch (error) {
        console.error('Error fetching sessions: ', error);
    }
};

// In sessionController.js
exports.renderAllSessionsPage = async (req, res) => {
    try {
        // Access decoded JWT data from req.user
        const user = req.user;

        // Log or use the user data as needed
        console.log('Decoded JWT User:', user);
        if (user.Location_Id == "admin") {
            console.log("full access + pull out  sessions/all/admin");
        } else if (user.Location_Id == "branch manager") {
            console.log("full access   sessions/all/branch manager");
        } else if (user.Location_Id.search('Franchise') >= 0) {
            console.log("sessions/all/location name/owner");
        } else {
            console.log("sessions/create/location/");
        }

        // Get the date from the query parameter, default to today's date if not provided
        const istDate = convertToIST(new Date());
        const selectedDate = req.query.date || istDate.toISOString().split('T')[0]; // Default to today's date (YYYY-MM-DD)

        // Get sessions for the selected date
        const sessions = await sessionService.getSessionsForDate(selectedDate, user.Location_Id);



        if (!sessions || sessions.length === 0) {
            return res.render('sessions/allSessions', {
                sessions: [],
                selectedDate: selectedDate,
                user, // Pass user to the view
            });
        }

        // Render the page and pass the sessions and selected date
        res.render('sessions/allSessions', {
            sessions,
            selectedDate: selectedDate,
            user, // Pass user to the view
        });
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).send('Error loading sessions');
    }
};
exports.handleQrScan = (req, res) => {
    const token = req.body.token;
    const secretKey = 'secret_key_123';
    console.log("Received token:", token);

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, secretKey);
        const userData = JSON.parse(decoded.data);

        // If valid, return the user data
        res.json({ data: userData });
    } catch (err) {
        console.error("Error decoding token:", err);
        res.status(400).json({ error: 'Invalid token' });
    }
};
