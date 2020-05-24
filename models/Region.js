const mongoose = require('mongoose');
const Polygon = require('./schemas/Polygon');

const RegionSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    bounds: {
        type: Polygon,
        required: true
    },
    locations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Location',
        },
    ],
});

module.exports = mongoose.model('Region', RegionSchema);
