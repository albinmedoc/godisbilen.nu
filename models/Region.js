const mongoose = require('mongoose');
const GeoJSON = require('mongoose-geojson-schema');

const RegionSchema = mongoose.Schema({
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

module.exports = mongoose.model('Region', RegionSchema);
