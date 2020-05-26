const mongoose = require('mongoose');
const GeoJSON = require('mongoose-geojson-schema');

const OrderSchema = mongoose.Schema({
    order_number: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true
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
        type: mongoose.Schema.Types.Point,
        required: true,
    },
    region: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region',
        required: true,
    },
});

module.exports = mongoose.model('Order', OrderSchema);
