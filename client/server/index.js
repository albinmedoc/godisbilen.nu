const path = require('path');
const express = require('express');
const nunjucks = require('nunjucks');

const app = express();

const port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, '../dist'));
app.engine('html', nunjucks.render);
app.set('view engine', 'html');

// Serve static files (css, js, fonts, images, etc)
app.use(express.static(path.join(__dirname, '../dist/static')))
app.get(/^\/static\//i, (req, res) => {
    res.redirect("/" + req.path.replace(/^\/static\//i, ""));
});

app.get('/contact', (req, res) => {
    res.render('contact.html');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
