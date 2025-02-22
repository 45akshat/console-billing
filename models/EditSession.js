const mongoose = require('mongoose');

const editSessionSchema = new mongoose.Schema({
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
    oldSessionData: { type: Object, required: true },
    newSessionData: { type: Object, required: true },
    editedBy: { type: String, required: true },
    editedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EditSession', editSessionSchema);
