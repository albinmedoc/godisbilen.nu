const GiftCard = require('../models/giftcard');

const generate_codes = async (quantity, lenght) => {
    let existing_codes = await get_codes();

    let result = [];

    for (var i = 0; i < quantity; i++) {
        let code = generate_code(lenght);
        while (existing_codes.includes(code)) {
            code = generate_code(lenght);
        }
        result.push(code);
    }

    return result;
};

const generate_code = (lenght) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for (var i = 0; i < lenght; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }

    return result;
};

const save_codes = (codes) => {
    for (var i = 0; i < codes.length; i++) {
        let giftcard = new GiftCard({ code: codes[i] });
        giftcard.save();
    }
};

const get_codes = async () => {
    let codes = await GiftCard.find({}).exec();

    let result = [];
    for (var i = 0; i < codes.length; i++) {
        result.push(codes[i].code);
    }

    return result;
};

module.exports.generate_codes = generate_codes;
module.exports.save_codes = save_codes;
module.exports.get_codes = get_codes;
