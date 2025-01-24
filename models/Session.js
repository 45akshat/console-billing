const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    platform: {
        type: String,
        enum: ['PC', 'PS'],
        required: true,
    },
    Location_Id: {
        type: String,
        required: true,
    },
    UserID: {
        type: String,
        required: true,
    },
    tableNumber: {
        type: Number,
        required: true,
    },
    primaryContact: {
        name: {
            type: String,
            required: true,
        },
        contact: {
            type: String,
            required: true,
        },
    },
    isMember: {
        type: Boolean,
        required: true,
    },
    game: {
        type: String,
        required: true,
    },
    customers: [
        {
            name: {
                type: String,
                required: true,
            },
            sessionDuration: {
                type: Number,
                required: true,
            }
        },
    ],
    payment: {
        cash: {
            type: Number,
            required: true,
            default: 0,
        },
        online: {
            type: Number,
            required: true,
            default: 0,
        },
        wallet: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    discount: {
        type: Number,
        required: true,
        default: 0,
    },
    cash_discount: {
        type: Number,
        required: true,
        default: 0,
    },
    coupon: {
        type: String,
        default: null,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Session', sessionSchema);
