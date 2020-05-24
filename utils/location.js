const { Client, Status } = require('@googlemaps/google-maps-services-js');
const axios = require('axios');

const client = new Client({ axiosInstance: axios.create() });

const timeBetween = async (loc1, loc2) => {
    client
        .distancematrix({
            params: {
                origins: [{ lat: loc1.lat, lng: loc1.lng }],
                destinations: [{ lat: loc2.lat, lng: loc2.lng }],
                mode: 'driving',
                key: process.env.GOOGLE_MAPS_API_KEY,
            },
        })
        .then((r) => {
            if (r.data.status === Status.OK) {
                console.log(r.data.rows[0].elements[0].duration.value);
                return r.data.rows[0].elements[0].duration.value;
            }
            return 600;
        })
        .catch(() => {
            return 600;
        });
};

exports.timeBetween = timeBetween;
