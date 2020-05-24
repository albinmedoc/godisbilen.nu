const mongoose = require('mongoose');

const schema = mongoose.Schema({
    type: {
        type: String,
        enum: ['Polygon'],
        required: true,
    },
    coordinates: {
        type: [[[Number]]],
        required: true,
    },
});

module.exports = schema;
