const express = require('express');
const router = express.Router();
const moment = require('moment');
const ShortURL = require('../models/ShortURL');

router.get("/:path", async (req, res) => {
    let path = req.params.path;
    let short_url = await ShortURL.findOne({
        path: path
    });
    if(!short_url){
        res.status(404).send();
        return;
    }
    res.redirect(short_url.url);
});


router.post('/', (req, res) => {
    let path = req.body.path;
    let url = req.body.url;

    if(!path || !path.match(/^[0-9a-zA-Z]+$/) || !url){
        res.status(422).send();
        return;
    }
    let short_url = new ShortURL({
        path: path,
        url: url,
        visits: 0,
        created: moment.utc().toDate()
    });
    
    short_url.save().then(() => {
        res.json(short_url).send();
    }).catch(err => {
        res.status(422).json({message: `A short url with a path of (${path}) already exists.`}).send();
    });
});

module.exports = router;