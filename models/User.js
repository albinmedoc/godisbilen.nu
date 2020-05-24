const mongoose = require('mongoose');
const findOrCreate = require('mongoose-find-or-create');

const UserSchema = mongoose.Schema({
    phone_number: {
        type: String,
        required: true,
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    ],
});

UserSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', UserSchema);
