const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Region = require('../models/Region');
const utilsLocation = require('../utils/location');
const utilsDate = require('../utils/date');

// Get orders
router.get('/', async (req, res) => {

    // TODO, check query params, some has to be numbers, json and dates

    // Create query filter based on request query values
    let filter = {
        ...(req.query.order_number && {phone_number:req.query.order_number}),
        ...(req.query.phone_number && {phone_number:req.query.phone_number}),
        ...(req.query.placed && {phone_number:req.query.placed}),
        ...(req.query.phase && {phone_number:req.query.phase}),
        ...(req.query.estimated_delivery && {phone_number:req.query.estimated_delivery}),
        ...(req.query.completed && {phone_number:req.query.completed}),
        ...(req.query.location && {phone_number:req.query.location}),
        ...(req.query.region && {phone_number:req.query.region}),
    };

    // Get orders from database
    let orders = await Order.find(filter).exec();

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
    if (err_r) res.status(500).send();
    if (!region)
        res.status(422)
            .json({ message: 'Coordinates is outside regions' })
            .send();

    // Get last order
    let err_l,
        last_order = await Order.findOne({
            placed: { $lte: Date.now() },
            region: region._id,
            $or: [{ phase: 1 }, { phase: 2 }],
        })
            .sort({ placed: 'descending' })
            .exec();
    if (err_l) res.status(500).send();

    // Calculate time between the new order´s location and last order´s location if last order exists, otherwise start location
    let err_t,
        time_between = await utilsLocation.timeBetween(
            last_order
                ? last_order.location.coordinates
                : JSON.parse(process.env.START_LOC),
            point.coordinates
        );

    // Create new order
    let order = new Order({
        order_number: Date.now().toString(),
        phone_number: phone_number,
        estimated_delivery: utilsDate.dateAdd(
            last_order ? last_order.estimated_delivery : new Date(),
            'second',
            time_between
        ),
        location: point,
        region: region._id,
    });
    order.save();

    res.json(order).send();
});

module.exports = router;
