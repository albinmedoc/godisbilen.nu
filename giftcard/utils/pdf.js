const handlebars = require('handlebars');
const pdf = require('html-pdf');
const fs = require('fs');

const create = async (document, options) => {
    return new Promise((resolve, reject) => {
        if (!document || !document.filename || !document.data) {
            reject(new Error('Some, or all options are missing.'));
        }

        try {
            var file = fs.readFileSync(document.filename, 'utf-8');
        } catch (err) {
            if (err.code === 'ENOENT') {
                reject(new Error('File not found'));
            } else {
                reject(err);
            }
        }

        let html = handlebars.compile(file)(document.data);

        pdf.create(html, options).toBuffer((err, buffer) => {
            resolve(buffer);
        });
    });
};

module.exports.create = create;
