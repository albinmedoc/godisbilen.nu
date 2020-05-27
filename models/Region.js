const mongoose = require('mongoose');
require('mongoose-geojson-schema');

const schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        required: true,
        default: true,
    },
    bounds: {
        type: mongoose.Schema.Types.Polygon,
        required: true,
    },
});

module.exports = mongoose.model('Region', schema);
