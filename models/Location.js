const mongoose = require('mongoose');
const findOrCreate = require('mongoose-find-or-create');
const Point = require('./schemas/Point');

const LocationSchema = mongoose.Schema({
    point: {
        type: Point,
        required: true,
    },
    region: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region',
        required: true,
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
    ],
});

LocationSchema.plugin(findOrCreate);

module.exports = mongoose.model('Location', LocationSchema);
