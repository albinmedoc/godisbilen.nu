const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/User');

// Load env
dotenv.config({
    path: './config.env',
});

// Create express app
const app = express();
app.use(express.json());

// Dev logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    mongoose.set('debug', true);
}

// Connect to DB
mongoose.connect(
    process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Connected to Database!');
    }
);

// Route for authorization
app.get('/authorize', async (req, res) => {
    let b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    let [phone_number, password] = Buffer.from(b64auth, 'base64')
        .toString()
        .split(':');

    // Get user from database
    let user = await User.findOne({ phone_number }).exec();

    // Check if user exists and if passwords matches
    if (user && user.comparePassword(password)) {
        res.status(200).send();
    } else {
        res.status(401).send();
    }
});

app.listen(process.env.PORT);
