const mongoose = require('mongoose');

const schema = mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model('GiftCard', schema);
