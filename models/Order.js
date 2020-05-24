const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    order_number_id: {
        type: String,
        required: true,
    },
    placed: {
        type: Date,
        required: true,
        default: Date.now,
    },
    phase: {
        type: Number,
        required: true,
        default: 1,
    },
    estimated_delivery: {
        type: Date,
        required: true,
    },
    completed: {
        type: Date,
        require: false,
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

module.exports = mongoose.model('Order', OrderSchema);
