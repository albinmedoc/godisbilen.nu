const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

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
        if(err){
            console.log(err);
            return;
        }
        console.log('Connected to Database!')
    }
);

// Import routes
const ordersRoute = require('./routes/orders');
app.use('/orders', ordersRoute);

const shortURLRoute = require('./routes/short_url');
app.use('/short_url', shortURLRoute);

app.listen(8080);
