const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load env
dotenv.config({
    path: './config.env',
});

const app = express();

app.listen(8080);