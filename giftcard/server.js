const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const pdf = require('./utils/pdf');
const {generate_codes} = require('./utils/code');

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

app.get('/giftcodes/generate', async (req, res) => {
    res.setHeader('Content-type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename.pdf');

    let html = path.join(__dirname, '/template/template.html');

    let css = path.join('file://', __dirname, '/template/style.css');

    let logo = path.join('file://', __dirname, '/template/logo.svg');

    let codes = await generate_codes(10, 15);

    let options = {
        format: 'A4',
        orientation: 'portrait',
        border: '5mm',
    };

    let document = {
        filename: html,
        data: { css: css, logo: logo, codes: codes },
    };

    pdf.create(document, options).then((buffer) => {
        res.end(buffer);
    });
});

app.listen(8080);
