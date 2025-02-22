const EditSession = require('../models/EditSession');

exports.saveEditSession = async (sessionId, oldSessionData, newSessionData, editedBy) => {
    const editSession = new EditSession({
        sessionId,
        oldSessionData,
        newSessionData,
        editedBy
    });
    return await editSession.save();
};

exports.getAllEditSessions = async () => {
    return await EditSession.find().populate('sessionId').populate('editedBy');
};
