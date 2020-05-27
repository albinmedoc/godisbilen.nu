const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const schema = mongoose.Schema({
    path: {
        type: String,
        required: true,
        unique: 'There is already a short url with path ({VALUE})'
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

schema.plugin(beautifyUnique);

module.exports = mongoose.model('ShortURL', schema);
