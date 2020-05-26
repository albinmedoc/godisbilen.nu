const { Client, Status } = require('@googlemaps/google-maps-services-js');
const axios = require('axios');

const client = new Client({ axiosInstance: axios.create() });

const timeBetween = async (loc1, loc2) => {
    try {
        let res = await client.distancematrix({
            params: {
                origins: [{ lat: loc1[0], lng: loc1[1] }],
                destinations: [{ lat: loc2[0], lng: loc2[1] }],
                mode: 'driving',
                key: process.env.GOOGLE_MAPS_API_KEY,
            },
        });
        if (res.data.status === Status.OK) {
            return res.data.rows[0].elements[0].duration.value;
        }
        return 600;
    } catch (error) {
        return 600;
    }
};

exports.timeBetween = timeBetween;
