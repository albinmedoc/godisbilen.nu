const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');
const BudgetSMS = require('../utils/sms');
const Order = require('../models/Order');
const Region = require('../models/Region');
const utilsLocation = require('../utils/location');
const auth = require('../middleware/auth');

// Get orders
router.get('/', auth, async (req, res) => {
    // Parse location
    try {
        var location = req.query.location
            ? {
                  type: 'Point',
                  coordinates: JSON.parse(req.query.location),
              }
            : undefined;
    } catch (error) {
        res.status(422)
            .json({ message: 'Could not parse coordinates.' })
            .send();
    }

    let filter = [
        // Add new fields
        {
            $addFields: {
                placed_date: {
                    $dateToString: {
                        format: '%Y-%m-%d',
                        date: '$placed',
                    },
                },
                estimated_delivery_date: {
                    $dateToString: {
                        format: '%Y-%m-%d',
                        date: '$estimated_delivery',
                    },
                },
                completed_date: {
                    $dateToString: {
                        format: '%Y-%m-%d',
                        date: '$completed',
                    },
                },
            },
        },

        // Filter fields based on request query params
        {
            $match: {
                ...(req.query.id && {
                    _id: new mongoose.Types.ObjectId(req.query.id),
                }),
                ...(req.query.order_number && {
                    order_number: req.query.order_number,
                }),
                ...(req.query.phone_number && {
                    phone_number: req.query.phone_number,
                }),
                ...(req.query.placed && {
                    placed_date: req.query.placed,
                }),
                ...(req.query.phase && { phase: req.query.phase }),
                ...(req.query.estimated_delivery && {
                    estimated_delivery_date: req.query.estimated_delivery,
                }),
                ...(req.query.completed && {
                    completed_date: req.query.completed,
                }),
                ...(location && { location: location }),
                ...(req.query.region && { region: req.query.region }),
            },
        },
        // Hide added fields
        {
            $project: {
                placed_date: 0,
                estimated_delivery_date: 0,
                completed_date: 0,
            },
        },
    ];

    // Get orders from database
    let orders = await Order.aggregate(filter).exec();

    res.json(orders).send();
});

// Create a new order
router.post('/', async (req, res) => {
    let lat = req.body.lat;
    let lng = req.body.lng;
    let phone_number = req.body.phone_number;
    if (!lat || !lng || !phone_number) {
        res.status(422).send();
        return;
    }

    let point = {
        type: 'Point',
        coordinates: [lat, lng],
    };

    // Get the region where the lat & lng is in
    let err_r,
        region = await Region.findOne({})
            .where('bounds')
            .intersects(point)
            .exec();
    if (err_r) return res.status(500).send();
    if (!region)
        res.status(422)
            .json({ message: 'Coordinates is outside regions' })
            .send();

    // Get last order
    let err_l,
        last_order = await Order.findOne({
            placed: { $lte: moment.utc().toDate() },
            region: region._id,
            $or: [{ phase: 1 }, { phase: 2 }],
        })
            .sort({ placed: 'descending' })
            .exec();
    if (err_l) return res.status(500).send();

    // Calculate time between the new order´s location and last order´s location if last order exists, otherwise start location
    let err_t,
        time_between = await utilsLocation.timeBetween(
            last_order
                ? last_order.location.coordinates
                : JSON.parse(process.env.START_LOC),
            point.coordinates
        );
    if (err_t) return res.status(500).send();

    // Create new order
    let order = new Order({
        order_number: moment.utc().toString(),
        phone_number: phone_number,
        placed: moment.utc(new Date()).toDate(),
        estimated_delivery: moment
            .utc(last_order ? last_order.estimated_delivery : new Date())
            .add(time_between, 'seconds')
            .toDate(),
        location: point,
        region: region._id,
    });
    order.save();

    // Send 200 response, order was confirmed and saved
    res.json(JSON.stringify(order)).status(200).send();

    // Send SMS
    let sms = new BudgetSMS();
    sms.from('Godisbilen')
        .to(process.env.ADMIN_PHONE_NUMBER)
        .message('Ny beställning!')
        .send()
        .then((result) => {
            res.json(result).send();
        })
        .catch((err) => console.log(err));
});

module.exports = router;
