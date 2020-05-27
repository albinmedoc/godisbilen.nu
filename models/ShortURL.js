const mongoose = require('mongoose');

const schema = mongoose.Schema({
    path: {
        type: String,
        required: true,
        createIndexes: true,
    },
    url: {
        type: String,
        required: true,
    },
    visits: {
        type: Number,
        required: true,
    },
    created: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model('ShortURL', schema);
