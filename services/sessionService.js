const Session = require('../models/Session');
const Code = require('../models/Code');

// Create a new session
exports.createSession = async (sessionData) => {
    try {
        // Create a new session with the provided data
        const session = new Session(sessionData);

        // Find the earliest start time and the latest end time among all customers
        let startTime = new Date(session.customers[0].startTime);
        let endTime = new Date(session.customers[0].endTime);

        // Iterate through all customers to find the earliest start time and the latest end time
        session.customers.forEach(customer => {
            const customerStartTime = new Date(customer.startTime);
            const customerEndTime = new Date(customer.endTime);

            // Compare and set the earliest start time
            if (customerStartTime < startTime) {
                startTime = customerStartTime;
            }

            // Compare and set the latest end time
            if (customerEndTime > endTime) {
                endTime = customerEndTime;
            }
        });

        // Set the session's start and end times
        session.sessionStartTime = startTime;
        session.sessionEndTime = endTime;

        // If a coupon is provided, mark its validity as 'Used'
        if (session.coupon) {
            await Code.findOneAndUpdate(
                { Code: session.coupon },
                { Validity: 'Used' },
                { new: true }
            );
        }

        // Save the session to the database
        await session.save();

        return session;
    } catch (error) {
        console.error('Error creating session:', error);
        throw new Error('Error creating session');
    }
};


// Update full session details (including customers, payment, and other session info)

exports.updateSessionDetails = async (sessionId, updates) => {
    try {
        // Find the session by ID and update with new data
        const updatedSession = await Session.findByIdAndUpdate(
            sessionId,               // The session ID to update
            { $set: updates },       // Fields to update
            { new: true }            // Return the updated document
        );

        if (!updatedSession) {
            throw new Error('Session not found'); // Throw error if session doesn't exist
        }

        return updatedSession;
    } catch (error) {
        console.error('Error in updateSessionDetails:', error);
        throw new Error('Unable to update session details');
    }
};

// Get session details by ID
exports.getSessionById = async (sessionId) => {
    try {
        const session = await Session.findById(sessionId);
        if (!session) {
            throw new Error('Session not found');
        }
        return session;
    } catch (error) {
        console.error('Error fetching session:', error);
        throw new Error('Error fetching session');
    }
};

// Get all sessions (optional: can add filters like date ranges)
exports.getAllSessions = async () => {
    try {
        const sessions = await Session.find();
        return sessions;
    } catch (error) {
        console.error('Error fetching all sessions:', error);
        throw new Error('Error fetching all sessions');
    }
};


// Get sessions for a specific date and location
exports.getSessionsForDate = async (date, Location_Id) => {
    try {
        // Get the current date if no date is provided
        const targetDate = date ? new Date(date) : new Date();

        // Adjust the date to IST (Indian Standard Time)
        const IST_OFFSET = 330 * 60 * 1000; // IST is UTC+5:30
        const startOfDay = new Date(targetDate.getTime() + IST_OFFSET);
        startOfDay.setUTCHours(0, 0, 0, 0); // Set to the start of the day in UTC

        const endOfDay = new Date(startOfDay);
        endOfDay.setUTCHours(23, 59, 59, 999); // Set to the end of the day in UTC

        // Build the query based on Location_Id
        const query = {
            createdAt: {
                $gte: startOfDay, // Start of the day
                $lte: endOfDay,   // End of the day
            },
        };

        // If Location_Id is not 'admin', filter by Location_Id
        if (Location_Id !== 'admin') {
            // Remove '-admin' from Location_Id if it contains it
            query.Location_Id = Location_Id.includes('-admin') 
                ? Location_Id.replace('-admin', '') 
                : Location_Id;
        }

        // Query the database for sessions
        const sessions = await Session.find(query);

        return sessions;
    } catch (error) {
        console.error('Error retrieving sessions for date:', error);
        throw new Error('Unable to fetch sessions for the specified date.');
    }
};

// Get sessions for a specific date range and location
exports.getSessionsForDateRange = async (startDate, endDate, Location_Id) => {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Adjust the dates to IST (Indian Standard Time)
        const IST_OFFSET = 330 * 60 * 1000; // IST is UTC+5:30
        const startOfDay = new Date(start.getTime() + IST_OFFSET);
        startOfDay.setUTCHours(0, 0, 0, 0); // Set to the start of the day in UTC

        const endOfDay = new Date(end.getTime() + IST_OFFSET);
        endOfDay.setUTCHours(23, 59, 59, 999); // Set to the end of the day in UTC

        // Build the query based on Location_Id
        const query = {
            createdAt: {
                $gte: startOfDay, // Start of the range
                $lte: endOfDay,   // End of the range
            },
        };

        // If Location_Id is not 'admin', filter by Location_Id
        if (Location_Id !== 'admin') {
            // Remove '-admin' from Location_Id if it contains it
            query.Location_Id = Location_Id.includes('-admin') 
                ? Location_Id.replace('-admin', '') 
                : Location_Id;
        }

        // Query the database for sessions
        const sessions = await Session.find(query);

        return sessions;
    } catch (error) {
        console.error('Error retrieving sessions for date range:', error);
        throw new Error('Unable to fetch sessions for the specified date range.');
    }
};

// Get all unique locations
exports.getAllLocations = async () => {
    try {
        const locations = await Session.distinct('Location_Id');
        return locations;
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw new Error('Error fetching locations');
    }
};

