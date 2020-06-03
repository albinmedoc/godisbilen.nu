const axios = require('axios');

module.exports = (req, res, next) => {
    if (req.headers.authorization) {
        axios({
            url: process.env.AUTHENTICATION_SERVICE_URL + '/authorize',
            method: 'get',
            headers: {
                Authorization: req.headers.authorization,
            },
        }).then(() => {
            next();
        }).catch(() => {
            res.status(401).json({
                error: 'Unauthorized',
            });
        });
    } else {
        res.status(401).json({
            error: 'Authentication Required',
        });
    }
};
