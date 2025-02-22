const EditSession = require('../models/EditSession');

exports.createEditSession = async (req, res) => {
    try {
        const { sessionId, oldSessionData, newSessionData, editedBy } = req.body;
        const editSession = new EditSession({
            sessionId,
            oldSessionData,
            newSessionData,
            editedBy
        });
        await editSession.save();
        res.status(201).json({ message: 'Edit session data saved successfully', editSession });
    } catch (error) {
        res.status(500).json({ message: 'Error saving edit session data', error });
    }
};

exports.getEditSessions = async (req, res) => {
    try {
        const editSessions = await EditSession.find().populate('editedBy');
        res.status(200).json(editSessions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching edit session data', error });
    }
};

// Helper function to convert date to IST
const convertToIST = (date) => {
    const istOffset = 330; // IST offset in minutes (UTC+5:30)
    return new Date(date.getTime() + (istOffset * 60 * 1000));
};

// In sessionController.js
exports.renderEditLogsPage = async (req, res) => {
    try {
        // Check if the user's location ID is 'admin'
        if (req.user.locationId !== 'admin') {
            return res.status(403).send('Access not allowed. Go back.');
        }

        let { startDate, endDate } = req.query;

        // Validate and set default dates if necessary
        const today = new Date();
        if (!startDate || isNaN(new Date(startDate).getTime())) {
            startDate = today.toISOString().split('T')[0];
        }
        if (!endDate || isNaN(new Date(endDate).getTime())) {
            endDate = today.toISOString().split('T')[0];
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Set end time to the end of the day

        // Fetch edit logs within the date range
        const editLogs = await EditSession.find({
            editedAt: {
                $gte: start,
                $lte: end
            }
        });

        if (editLogs.length > 0) {
            // Convert editedAt to IST
            editLogs.forEach(log => {
                log.editedAt = convertToIST(new Date(log.editedAt));
            });
        }

        // Render the page and pass the edit logs
        res.render('sessions/editLogs', {
            editLogs,
            startDate,
            endDate
        });
    } catch (error) {
        console.error('Error fetching edit logs:', error);
        res.status(500).send('Error loading edit logs');
    }
};
